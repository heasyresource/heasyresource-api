import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AddVacancyValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }),
    slug: schema.string.optional({ trim: true }),
    jobCategoryId: schema.string({ trim: true }),
    employmentTypeId: schema.string({ trim: true }),
    workMode: schema.string({ trim: true }),
    location: schema.string({ trim: true }),
    description: schema.string({ trim: true }),
    hiringManager: schema.string({ trim: true }),
    numberOfPosition: schema.string({ trim: true }),
    companyId: schema.string({ trim: true }),
    link: schema.string({ trim: true }),
    isActive: schema.boolean(),
    isPublished: schema.boolean(),
  })

  public messages: CustomMessages = {
    'title.required': 'Vacancy Title is required.',
    'jobCategoryId.required': 'Job Category is required.',
    'employmentTypeId.required': 'Employment Type is required.',
    'workMode.required': 'Work Mode is required.',
    'location.required': 'Location is required.',
    'description.required': 'Vacancy Description is required.',
    'hiringManager.required': 'Hiring Manager is required.',
    'numbeOfPosition.required': 'Number of Position is required.',
    'companyId.required': 'Company is required.',
    'link.required': 'Vacancy Link is required.',
    'isActive.required': 'Active status is required.',
    'isPublished.required': 'Published status is required.',
  }
}
