import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RefreshTokenValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    refreshToken: schema.string({ trim: true },[rules.maxLength(64), rules.minLength(64)]),
  })

  public messages: CustomMessages = {
    'refreshToken.required': 'refresh token is required.',
    'refreshToken.maxLength': 'refresh token must not be more than to 64 characters.',
    'refreshToken.minLength': 'refresh token must be up to 64 characters.',
  }
}
