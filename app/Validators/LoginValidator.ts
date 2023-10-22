import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
    ]),
    password: schema.string(),
  })

  public messages: CustomMessages = {
    'email.required': 'Email address is required.',
    'email.email': 'Email address must be a valid email address.',
    'password.required': 'Password is required.'
  }
}
