import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EmployeeEducationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    institution: schema.string({ trim: true }),
    degree: schema.string({ trim: true }),
    fieldOfStudy: schema.string({ trim: true }),
    grade: schema.string({ trim: true }),
    startDate: schema.string(),
    endDate: schema.string(),
    description: schema.string.optional({ trim: true }),
  })

  public messages: CustomMessages = {
    'institution.required': 'Institution is required.',
    'degree.required': 'Degree is required.',
    'fieldOfStudy.required': 'Field of Study is required.',
    'grade.required': 'Grade is required.',
    'startDate.required': 'Start Date is required.',
    'endDate.required': 'End Date is required.',
    'description.required': 'Description is required.',
    'description.alphaNum': 'Description should only contain alphanumeric characters.',
  }
}
