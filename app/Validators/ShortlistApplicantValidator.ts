import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ShortlistApplicantValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    reason: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {
    'reason.required': 'Reason is required',
  }
}
