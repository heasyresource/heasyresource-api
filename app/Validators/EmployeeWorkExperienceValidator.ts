import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WorkModes from 'App/Enums/WorkModes'

export default class EmployeeWorkExperienceValidator {
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
    companyName: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['space', 'dash'],
      }),
    ]),
    position: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['space', 'dash'],
      }),
    ]),
    location: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['space', 'dash'],
      }),
    ]),
    employmentTypeId: schema.string({ trim: true }, [
      rules.uuid(),
      rules.exists({
        table: 'employment_types',
        column: 'id',
        where: {
          is_deleted: false,
        },
      }),
    ]),
    workMode: schema.enum(Object.values(WorkModes)),
    description: schema.string.optional({ trim: true }),
    startDate: schema.date(),
    endDate: schema.date(),
    isPresent: schema.boolean(),
  })

  public messages: CustomMessages = {
    // 'userId.required': 'Please select a valid user .',
    // 'userId.uuid': 'Please select a valid user.',
    // 'userId.exists': 'Please select a valid user.',
    'companyName.required': 'Company Name is required.',
    'companyName.alpha': 'Company Name should only contain alphabets',
    'position.required': 'Position is required.',
    'position.alpha': 'Position should only contain alphabets',
    'location.required': 'Location is required.',
    'location.alpha': 'Location should only contain alphabets',
    'employmentTypeId.required': 'Please select a valid employment type.',
    'employmentTypeId.uuid': 'Please select a valid employment type.',
    'employmentTypeId.exists': 'Please select a valid employment type.',
    'workMode.required': 'Work mode is required.',
    'workMode.enum': 'Please select a correct work mode.',
    'description.required': 'Description is required.',
    'description.alphaNum': 'Description should only contain alphanumeric characters.',
    'startDate.required': 'Start Date is required.',
    'endDate.required': 'End Date is required.',
    'isPresent.boolen': 'Please select a valid option',
  }
}
