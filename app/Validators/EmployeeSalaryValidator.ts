import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Frequency from 'App/Enums/Frequency'

export default class EmployeeSalaryValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    grossSalary: schema.number(),
    frequency: schema.enum(Object.values(Frequency)),
    currency: schema.string()
  })

  public messages: CustomMessages = {
    'grossSalary.required': 'Gross Salary is required.',
    'grossSalary.number': 'Gross Salary must be digits.',
    'frequency.required': 'Frequency is required.',
    'frequency.enum': 'Please select a correct frequency.',
    'currency.required': 'Currency is required.',
  }
}
