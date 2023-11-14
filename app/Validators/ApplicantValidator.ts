import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ApplicantValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    firstName: schema.string({ trim: true }),
    lastName: schema.string({ trim: true }),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: true,
        gmailRemoveSubaddress: true,
      }),
    ]),
    phoneNumber: schema.string([
      rules.mobile({
        strict: false,
        locale: ['en-NG'],
      }),
    ]),
    address: schema.string({ trim: true }),
    city: schema.string({ trim: true }),
    stateId: schema.string({ trim: true }, [
      rules.uuid(),
      rules.exists({
        table: 'states',
        column: 'id',
        where: {
          is_deleted: false,
        },
      }),
    ]),
    countryId: schema.string({ trim: true }, [
      rules.uuid(),
      rules.exists({
        table: 'countries',
        column: 'id',
        where: {
          is_deleted: false,
        },
      }),
    ]),
    resumeUrl: schema.string([rules.url()]),
    // status: schema.string({ trim: true }),
    // reason: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {
    'firstName.required': 'First Name is required.',
    'lastName.required': 'Last Name is required.',
    'email.required': 'Email address is required.',
    'email.email': 'Email address must be a valid email address.',
    'mobilePhoneNumber.required': 'Phone number is required.',
    'phoneNumber.mobile': 'Phone number must be a valid phone number',
    'address.required': 'Address is required.',
    'city.required': 'City is required.',
    'stateId.required': 'Please select a valid state.',
    'stateId.uuid': 'Please select a valid state.',
    'stateId.exists': 'Please select a valid state.',
    'countryId.required': 'Please select a valid country.',
    'countryId.uuid': 'Please select a valid country.',
    'countryId.exists': 'Please select a valid country.',
    'resumeUrl.required': 'Resume is required.',
    'resumeUrl.url': 'Resume must be a valid url.',
  }
}
