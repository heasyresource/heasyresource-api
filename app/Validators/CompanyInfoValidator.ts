import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CompanyInfoValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    companyName: schema.string({ trim: true }, [
      rules.unique({ table: 'companies', column: 'name' }),
    ]),
    companyEmail: schema.string({ trim: true }, [
      rules.email(),
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: true,
        gmailRemoveSubaddress: true,
      }),
      rules.unique({ table: 'companies', column: 'email' }),
    ]),
    companyWebsite: schema.string({ trim: true }, [
      rules.url(),
      rules.unique({ table: 'companies', column: 'website' }),
    ]),
    industryId: schema.string({ trim: true }, [rules.uuid()]),
    companyPhoneNumber: schema.string([
      rules.mobile({
        strict: true,
        locale: ['en-NG'],
      }),
      rules.unique({ table: 'companies', column: 'phone_number' }),
    ])
  })

  public messages: CustomMessages = {
    'companyName.required': 'Company name is required.',
    'companyName.unique': 'Company name already exist.',
    'companyEmail.required': 'Company email address is required.',
    'companyEmail.email': 'Company email address must be a valid email address.',
    'companyEmail.unique': 'Company email address already exist.',
    'companyWebsite.required': 'Company website is required.',
    'companyWebsite.unique': 'Company website already exist.',
    'companyWebsite.url': 'Company website must be a valid url.',
    'industryId.required': 'Please select a valid field/industry.',
    'industryId.uuid': 'Please select a valid field/industry.',
    'companyPhoneNumber.required': 'Phone number is required.',
    'companyPhoneNumber.mobile':
      'Phone number must be a valid phone number and it must prefixed with country code.',
    'companyPhoneNumber.unique': 'This phone number already exist.',
  }
}
