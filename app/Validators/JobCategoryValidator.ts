import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class JobCategoryValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }),
    companyId: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {
    'name.required': 'Job category name is required',
    'companyId.required': 'Company Type is required',
  }
}
