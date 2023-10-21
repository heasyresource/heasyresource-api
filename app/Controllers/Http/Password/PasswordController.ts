import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ResetPassword from 'App/Mailers/ResetPassword'
import User from 'App/Models/User'
import EmailValidator from 'App/Validators/EmailValidator'
import randomstring from 'randomstring'
import Env from '@ioc:Adonis/Core/Env'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'
import Hash from '@ioc:Adonis/Core/Hash'
import VerifyResetPasswordValidator from 'App/Validators/VerifyResetPasswordValidator'

const verificationCodeValidity = Env.get('VERIFICATION_CODE_EXPIRY_TIME_IN_MS', 600000)
const verificationCodeWaitTime = Env.get('VERIFICATION_CODE_RETRY_TIME_IN_MS', 60000)

export default class PasswordController {
  public async forgotPassword({ response, request }: HttpContextContract) {
    const validatedBody = await request.validate(EmailValidator)

    const { email } = validatedBody

    const user = await User.findBy('email', email)

    if (!user) {
      return response.badRequest({
        status: 'Bad Request',
        message: 'Incorrect email.',
        statusCode: 400,
      })
    }
    if (user.isVerified == false) {
      return response.unauthorized({
        status: 'Unauthorized',
        message: 'Your account have not been verified, please verify your account.',
        statusCode: 401,
      })
    }

    if (user.isActive == false) {
      return response.unauthorized({
        status: 'Unauthorized',
        message: 'Your account have been deactivated, please contact the admin.',
        statusCode: 401,
      })
    }

    const currentTime = new Date().getTime()
    const verificationCodeSendTime = user.verificationCodeSentAt
      ? user.verificationCodeSentAt.toMillis()
      : 0
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

    await new ResetPassword(user).sendLater()

    return response.status(200).json({
      status: 'Success',
      message: 'Reset password code sent successfully.',
      statusCode: 200,
    })
  }

  public async verifyResetPasswordCode({ response, request }: HttpContextContract) {
    const validatedBody = await request.validate(VerifyResetPasswordValidator)

    const { email, resetPasswordCode } = validatedBody

    const user = await User.query()
      .where('email', email)
      .where('verificationCode', resetPasswordCode)
      .first()

    if (!user) {
      return response.badRequest({
        status: 'Bad Request',
        message: 'Invalid reset password code.',
        statusCode: 400,
      })
    }

    return response.ok({
      status: 'Success',
      message: 'Reset password code is valid.',
      statusCode: 200,
    })
  }

  public async resetPassword({ response, request }: HttpContextContract) {
    const validatedBody = await request.validate(ResetPasswordValidator)

    const { email, resetPasswordCode, newPassword } = validatedBody

    const user = await User.query()
      .where('email', email)
      .where('verificationCode', resetPasswordCode)
      .first()

    if (!user) {
      return response.badRequest({
        status: 'Bad Request',
        message: 'Invalid reset password code.',
        statusCode: 400,
      })
    }

    // Check if the new password and old password is the same
    if (await Hash.verify(user.password, newPassword)) {
      return response.badRequest({
        status: 'Bad Request',
        message: 'Old password and new password cannot be the same.',
        statusCode: 400,
      })
    }

    const currentTime = new Date().getTime()
    const verificationCodeSendTime = user.verificationCodeSentAt
      ? user.verificationCodeSentAt.toMillis()
      : 0
    const timeDifference = currentTime - verificationCodeSendTime

    if (timeDifference <= verificationCodeValidity) {
      user.verificationCode = null
      user.password = newPassword
      await user.save()

      return response.ok({
        status: 'Success',
        message: 'Reset password successfully.',
        statusCode: 200,
      })
    } else {
      user.verificationCode = null
      await user.save()

      return response.badRequest({
        status: 'Bad Request',
        message: 'Reset password code expired.',
        statusCode: 400,
      })
    }
  }
}
