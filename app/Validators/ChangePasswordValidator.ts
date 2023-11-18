import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ChangePasswordValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    newPassword: schema.string({ trim: true }, [
      rules.regex(
        /^(?=.*[$&+,:;=?@#|'<>.^*()%!-])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/
      ),
    ]),
    currentPassword: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {
    'newPassword.required': 'New password is required.',
    'newPassword.regex':
      'New password must be at least 8 characters long and contain at least one letter, one digit, and one special character.',
    'currentPassword.required': 'Current password is required.',
  }
}
