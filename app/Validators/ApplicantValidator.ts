import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ApplicantValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    firstName: schema.string({ trim: true }),
    lastName: schema.string({ trim: true }),
    email: schema.string({ trim: true }),
    phoneNumber: schema.string({ trim: true }),
    address: schema.string({ trim: true }),
    city: schema.string({ trim: true }),
    stateId: schema.string({ trim: true }),
    countryId: schema.string({ trim: true }),
    vacancyId: schema.string({ trim: true }),
    resumeUrl: schema.string({ trim: true }),
    status: schema.string({ trim: true }),
    reason: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {
    'firstName.required': 'First Name is required.',
    'lastName.required': 'Last Name is required.',
    'email.required': 'Email is required.',
    'phoneNumber.required': 'Phone Number is required.',
    'address.required': 'Address is required.',
    'city.required': 'City is required.',
    'stateId.required': 'State is required.',
    'countryId.required': 'Country is required.',
    'vacancyId.required': 'Vacancy is required.',
    'resumeUrl.required': 'Resume is required.',
    'status.required': 'Status is required.',
    'reason.required': 'Reason is required.',
  }
}
