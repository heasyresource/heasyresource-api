import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import VerifyAccountValidator from 'App/Validators/VerifyAccountValidator'
import Env from '@ioc:Adonis/Core/Env'
import EmailValidator from 'App/Validators/EmailValidator'
import randomstring from 'randomstring'
import VerifyEmail from 'App/Mailers/VerifyEmail'

const verificationCodeValidity = Env.get('VERIFICATION_CODE_EXPIRY_TIME_IN_MS', 600000)
const verificationCodeWaitTime = Env.get('VERIFICATION_CODE_RETRY_TIME_IN_MS', 60000)

export default class VerificationController {
  public async verifyAccount({ auth, response, request }: HttpContextContract) {
    const validatedBody = await request.validate(VerifyAccountValidator)
    
    const { verificationCode, email } = validatedBody

    const user = await User.query()
      .where('email', email)
      .where('verificationCode', verificationCode)
      .first()

    if (!user) {
      return response.badRequest({
        status: 'Bad Request',
        message: 'Invalid verification code.',
        statusCode: 400,
      })
    }

    const currentTime = new Date().getTime()
    const verificationCodeSendTime = user.verificationCodeSentAt ? user.verificationCodeSentAt.toMillis() : 0
    const timeDifference = currentTime - verificationCodeSendTime

    if (timeDifference <= verificationCodeValidity) {
      user.isVerified = true
      user.isActive = true
      user.verificationCode = null
      await user.save()

      const token = await auth.use('jwt').generate(user)
      await user.load((loader) => {
        loader.load('role').load('company')
      })
      // await user.load('role')

      return response.ok({
        status: 'Success',
        message: 'Your account have been verified.',
        statusCode: 200,
        results: { token, user },
      })
    } else {
      user.verificationCode = null
      await user.save()

      return response.badRequest({
        status: 'Bad Request',
        message: 'Verification code expired.',
        statusCode: 400,
      })
    }
  }

  public async resendVerificationCode({ request, response }: HttpContextContract) {
    const validatedBody = await request.validate(EmailValidator)
    
    const { email } = validatedBody

    const user = await User.query().where('email', email).first()

    if (!user) {
      return response.badRequest({
        status: 'Bad Request',
        message: 'Incorrect email.',
        statusCode: 400,
      })
    }

    if (user.isVerified) {
      return response.badRequest({
        status: 'Bad Request',
        message: 'This account is already verified.',
        statusCode: 400,
      })
    }

    const currentTime = new Date().getTime()
    const verificationCodeSendTime = user.verificationCodeSentAt ? user.verificationCodeSentAt.toMillis() : 0
    const timeDifference = currentTime - verificationCodeSendTime

    if (timeDifference < verificationCodeWaitTime) {
      const timeLeft =
        Math.floor((verificationCodeWaitTime / 1000 / 60) << 0) -
        Math.floor((timeDifference / 1000 / 60) << 0)
      return response.badRequest({
        status: 'Bad Request',
        message: `You need to wait for ${
          timeLeft > 1
            ? `${timeLeft} minutes before you can generate another verification code.`
            : `a minute before you can generate another verification code.`
        }`,
        statusCode: 400,
      })
    }

    user.verificationCode = randomstring.generate({
      length: 6,
      charset: 'numeric',
    })
    await user.save()

    await new VerifyEmail(user).sendLater()

    return response.ok({
      status: 'Success',
      message: 'New verification code sent successfully.',
      statusCode: 200,
    })
  }
}
