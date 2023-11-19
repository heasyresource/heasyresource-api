import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EmploymentStatuses from 'App/Enums/EmploymentStatuses'

export default class EmployeeStatusValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    status: schema.enum(Object.values(EmploymentStatuses)),
  })

  public messages: CustomMessages = {
    'status.required': 'Status is required.',
    'status.enum': 'Please select a correct status.',
  }
}
