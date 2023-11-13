import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RejectLeaveValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    reasonForRejection: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {
    'reasonForRejection.required': 'Reason for rejection is required.',
  }
}
