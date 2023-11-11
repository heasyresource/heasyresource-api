import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EmployeeEducationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    // userId: schema.string({ trim: true }, [
    //   rules.uuid(),
    //   rules.exists({
    //     table: 'users',
    //     column: 'id',
    //     where: {
    //       is_deleted: false,
    //     },
    //   }),
    // ]),
    institution: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['space', 'dash'],
      }),
    ]),
    degree: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['dash', 'space'],
      }),
    ]),
    fieldOfStudy: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['dash', 'space'],
      }),
    ]),
    grade: schema.string({ trim: true }, [
      rules.alphaNum({
        allow: ['dash', 'space'],
      }),
    ]),
    startDate: schema.date(),
    endDate: schema.date(),
    description: schema.string.optional({ trim: true }),
  })

  public messages: CustomMessages = {
    // 'userId.required': 'Please select a valid user .',
    // 'userId.uuid': 'Please select a valid user.',
    // 'userId.exists': 'Please select a valid user.',
    'institution.required': 'Institution is required.',
    'institution.alpha': 'Institution should only contain alphabets',
    'degree.required': 'Degree is required.',
    'degree.alpha': 'Degree should only contain alphabets',
    'fieldOfStudy.required': 'Field of Study is required.',
    'fieldOfStudy.alpha': 'Field of Study should only contain alphabets',
    'grade.required': 'Grade is required.',
    'grade.alpha': 'Grade should only contain alphanumeric characters',
    'startDate.required': 'Start Date is required.',
    'endDate.required': 'End Date is required.',
    'description.required': 'Description is required.',
    'description.alphaNum': 'Description should only contain alphanumeric characters.',
  }
}
