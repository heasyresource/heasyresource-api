import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Statuses from 'App/Enums/Statuses'

export default class CompanyStatusValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    status: schema.enum(Object.values(Statuses).filter((status) => status !== Statuses.PENDING))
  })

  public messages: CustomMessages = {
    'status.required': 'Status is required.',
    'status.enum': 'Please select a correct status.',
  }
}
