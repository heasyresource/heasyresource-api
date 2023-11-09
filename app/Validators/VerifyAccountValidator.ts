import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VerifyAccountValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    verificationCode: schema.string([
      rules.maxLength(6),
      rules.minLength(6)
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: true,
        gmailRemoveSubaddress: true,
      }),
    ]),
  })

  public messages: CustomMessages = {
    'verificationCode.required': 'Verification code is required.',
    'verificationCode.maxLength': 'Invalid verification code.',
    'verificationCode.minLength': 'Invalid verification code.',
    'email.required': 'Email address is required.',
    'email.email': 'Email address must be a valid email address.',
  }
}
