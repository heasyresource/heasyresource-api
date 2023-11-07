import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EmployeeContactDetailsValidator {
  constructor(protected ctx: HttpContextContract) {}
  public refs = schema.refs({
    userId: this.ctx.params.userId || null,
  })

  public schema = schema.create({
    street: schema.string({ trim: true }),
    zipCode: schema.string({ trim: true }, [
      rules.alphaNum({
        allow: ['space', 'dash'],
      }),
    ]),
    lgaId: schema.string({ trim: true }, [
      rules.uuid(),
      rules.exists({
        table: 'lgas',
        column: 'id',
        where: {
          is_deleted: false,
        },
      }),
    ]),
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
    personalEmail: schema.string.optional({ trim: true }, [
      rules.email(),
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: true,
        gmailRemoveSubaddress: true,
      }),
    ]),
    mobilePhoneNumber: schema.string([
      rules.mobile({
        strict: true,
        locale: ['en-NG'],
      }),
      rules.unique({ table: 'users', column: 'phone_number', whereNot: { id: this.refs.userId } }),
    ]),
    homePhoneNumber: schema.string.optional([
      rules.mobile({
        strict: true,
        locale: ['en-NG'],
      }),
      rules.unique({
        table: 'contact_details',
        column: 'home_phone_number',
        whereNot: { user_id: this.refs.userId },
      }),
    ]),
    workPhoneNumber: schema.string.optional([
      rules.mobile({
        strict: true,
        locale: ['en-NG'],
      }),
      rules.unique({
        table: 'contact_details',
        column: 'work_phone_number',
        whereNot: { user_id: this.refs.userId },
      }),
    ]),
  })

  public messages: CustomMessages = {
    'street.required': 'Street is required.',
    'zipCode.required': 'Zip Code is required.',
    'zipCode.alpha': 'Zip Code should only contain alphanumeric characters.',
    'lgaId.required': 'Please select a valid lga.',
    'lgaId.uuid': 'Please select a valid lga.',
    'lgaId.exists': 'Please select a valid lga.',
    'stateId.required': 'Please select a valid state.',
    'stateId.uuid': 'Please select a valid state.',
    'stateId.exists': 'Please select a valid state.',
    'countryId.required': 'Please select a valid country.',
    'countryId.uuid': 'Please select a valid country.',
    'countryId.exists': 'Please select a valid country.',
    'personalEmail.email': 'Email address must be a valid email address.',
    'personalEmail.unique': 'This email address already exist.',
    'mobilePhoneNumber.required': 'Mobile Phone number is required.',
    'mobilePhoneNumber.unique': 'This phone number already exist.',
    'mobilePhoneNumber.mobile':
      'Phone number must be a valid phone number and it must prefixed with country code.',
    'homePhoneNumber.mobile':
      'Phone number must be a valid phone number and it must prefixed with country code.',
    'homePhoneNumber.unique': 'This phone number already exist.',

    'workPhoneNumber.mobile':
      'Phone number must be a valid phone number and it must prefixed with country code.',
    'workPhoneNumber.unique': 'This phone number already exist.',
  }
}
