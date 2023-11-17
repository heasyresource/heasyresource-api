import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AddUserToComponentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    userId: schema.string({ trim: true }),
    componentId: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {
    'userId.required': 'User is required',
    'componentId.required': 'Component is required',
  }
}
