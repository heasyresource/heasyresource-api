import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegistrationValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    companyName: schema.string({ trim: true }),
    companyEmail: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'companies', column: 'email' }),
    ]),
    companyWebsite: schema.string({ trim: true }, [rules.url()]),
    industryId: schema.string({ trim: true }, [rules.uuid()]),
    companyPhoneNumber: schema.string([
      rules.mobile({
        strict: true,
        locale: ['en-NG'],
      }),
      rules.unique({ table: 'companies', column: 'phone_number' }),
    ]),
    firstName: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['space', 'dash'],
      }),
    ]),
    lastName: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['space', 'dash'],
      }),
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string([
      rules.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
    ]),
  })

  public messages: CustomMessages = {
    'companyName.required': 'Company name is required.',
    'companyEmail.required': 'Company email address is required.',
    'companyEmail.email': 'Company email address must be a valid email address.',
    'companyEmail.unique': 'Company email address already exist.',
    'companyWebsite.required': 'Company website is required.',
    'companyWebsite.url': 'Company website must be a valid url.',
    'industryId.required': 'Please select a valid field/industry.',
    'industryId.uuid': 'Please select a valid field/industry.',
    'companyPhoneNumber.required': 'Phone number is required.',
    'companyPhoneNumber.mobile':
      'Phone number must be a valid phone number and it must prefixed with country code.',
    'companyPhoneNumber.unique': 'This phone number already exist.',
    'firstName.required': 'First name is required.',
    'firstName.alpha': 'First name should only contain alphabets.',
    'lastName.required': 'Last name is required.',
    'lastName.alpha': 'Last name should only contain alphabets.',
    'email.required': 'Email address is required.',
    'email.email': 'Email address must be a valid email address.',
    'email.unique': 'This email address already exist.',
    'password.required': 'Password is required.',
    'password.regex':
      'Password must be at least 8 characters long and contain at least one letter, one digit, and one special character.',
  }
}
