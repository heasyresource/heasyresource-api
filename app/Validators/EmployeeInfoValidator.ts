import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WorkModes from 'App/Enums/WorkModes'

export default class EmployeeInfoValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
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
    departmentId: schema.string({ trim: true }, [
      rules.uuid(),
      rules.exists({
        table: 'departments',
        column: 'id',
        where: {
          is_deleted: false,
        },
      }),
    ]),
    position: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['space', 'dash'],
      }),
    ]),
    workMode: schema.enum(Object.values(WorkModes)),
    resumptionDate: schema.string(),
  })

  public messages: CustomMessages = {
    'employmentTypeId.required': 'Please select a valid employment type.',
    'employmentTypeId.uuid': 'Please select a valid employment type.',
    'employmentTypeId.exists': 'Please select a valid employment type.',
    'departmentId.required': 'Please select a valid department.',
    'departmentId.uuid': 'Please select a valid department.',
    'departmentId.exists': 'Please select a valid department.',
    'position.required': 'Position is required.',
    'position.alpha': 'Position should only contain alphabets.',
    'workMode.required': 'Work mode is required.',
    'workMode.enum': 'Please select a correct work mode.',
    'resumptionDate.required': 'Resumption date is required.',
  }
}
