/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    /**
     * Self handle the validation exception
     */
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.unprocessableEntity({ status: 'Unprocessable Entity', statusCode: 422, errors: error.messages.errors })
    }

    if (error.message === 'No Authorization header passed' || error.code === 'E_UNAUTHORIZED_ACCESS') {
      return ctx.response.unauthorized({ status: 'Unauthorized', statusCode: 401, message: 'Authorization is required to access this resource.' })
    }

    if (error.message === 'Invalid refresh token') {
      return ctx.response.badRequest({ status: 'Bad Request', statusCode: 400, message: 'Invalid refresh token.' })
    }

    if (error.code === 'ERR_JWT_EXPIRED') {
      return ctx.response.unauthorized({ status: 'Unauthorized', statusCode: 401, message: 'Session Timeout. Please login again.' })
    }

    if (error.code === 'E_ROUTE_NOT_FOUND') {
      return ctx.response.notFound({ status: 'Not Found', statusCode: 404, message: 'Resource Not Found.' })
    }

    console.log('ERROR => ', error);
    
    if (error && process.env.NODE_ENV == 'production') {
      return ctx.response.internalServerError({ status: 'Internal Server Error', statusCode: 500, message: 'Internal Server Error.' })
    }

    /**
     * Forward rest of the exceptions to the parent class
     */
    return super.handle(error, ctx)
  }
}
