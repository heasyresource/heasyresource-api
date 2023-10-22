import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResetPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    resetPasswordCode: schema.string([
      rules.maxLength(6),
      rules.minLength(6)
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
    ]),
    newPassword: schema.string([rules.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)]),
  })

  public messages: CustomMessages = {
    'resetPasswordCode.required': 'Reset password code is required.',
    'resetPasswordCode.maxLength': 'Invalid reset password code.',
    'resetPasswordCode.minLength': 'Invalid reset password code.',
    'email.required': 'Email address is required.',
    'email.email': 'Email address must be a valid email address.',
    'newPassword.required': 'New password is required.',
    'newPassword.regex': 'New password must be at least 8 characters long and contain at least one letter, one digit, and one special character.',
  }
}
