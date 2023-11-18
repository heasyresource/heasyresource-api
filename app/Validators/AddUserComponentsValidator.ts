import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AddUserComponentsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    componentIds: schema.array().members(schema.string({ trim: true }, [rules.uuid()])),
  })

  public messages: CustomMessages = {
    'componentIds.required': 'Component is required',
    'componentIds.*.uuid': 'Please select a valid components.',
  }
}
