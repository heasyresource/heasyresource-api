import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WorkModes from 'App/Enums/WorkModes'

export default class AddVacancyValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }),
    jobCategoryId: schema.string({ trim: true }, [
      rules.uuid(),
      rules.exists({
        table: 'job_categories',
        column: 'id',
        where: {
          is_deleted: false,
        },
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
    location: schema.string.optional({ trim: true }),
    description: schema.string({ trim: true }),
    hiringManager: schema.string({ trim: true }),
    numberOfPosition: schema.string({ trim: true }),
    isActive: schema.boolean.optional(),
    isPublished: schema.boolean.optional(),
  })

  public messages: CustomMessages = {
    'title.required': 'Title is required.',
    'jobCategoryId.required': 'Please select a valid job category.',
    'jobCategoryId.uuid': 'Please select a valid job category.',
    'jobCategoryId.exists': 'Please select a valid job category.',
    'employmentTypeId.required': 'Please select a valid employment type.',
    'employmentTypeId.uuid': 'Please select a valid employment type.',
    'employmentTypeId.exists': 'Please select a valid employment type.',
    'workMode.required': 'Work mode is required.',
    'workMode.enum': 'Please select a correct work mode.',
    'description.required': 'Description is required.',
    'hiringManager.required': 'Hiring Manager is required.',
    'numberOfPosition.required': 'Number of Position is required.',
    'companyId.required': 'Company is required.',
    'isActive.boolean': 'Active must be either true or false.',
    'isPublished.boolean': 'Published must be either true or false.',
  }
}
