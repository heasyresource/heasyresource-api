import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import LoginValidator from 'App/Validators/LoginValidator'
import RefreshTokenValidator from 'App/Validators/RefreshTokenValidator'

export default class LoginController {
  public async login({ request, response, auth }: HttpContextContract) {
    const validatedBody = await request.validate(LoginValidator)
    
    const { email, password } = validatedBody

    const user = await User.query().where('email', email).preload('role').first()

    if (!user) {
      return response.unauthorized({
        status: 'Unauthorized',
        message: 'Invalid credentials.',
        statusCode: 400,
      })
    }

    if (!(await Hash.verify(user.password, password))) {
      return response.unauthorized({
        status: 'Unauthorized',
        message: 'Invalid credentials.',
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
    const token = await auth.use('jwt').generate(user)

    return response.ok({
      status: 'Success',
      message: 'Logged In Successfully.',
      statusCode: 200,
      user,
      token,
    })
  }

  public async refreshToken({ request, response, auth }: HttpContextContract) {
    const validatedBody = await request.validate(RefreshTokenValidator)
    
    const { refreshToken } = validatedBody
    
    const jwt = await auth.use('jwt').loginViaRefreshToken(refreshToken)
    return response.ok(jwt);
  }
}
