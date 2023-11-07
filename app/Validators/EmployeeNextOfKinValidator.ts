import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NextOfKinTypes from 'App/Enums/NextOfKinTypes'
import NextOfKInRelationships from 'App/Enums/NextOfKInRelationships'

export default class EmployeeNextOfKinValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    type: schema.enum(Object.values(NextOfKinTypes)),
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
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: true,
        gmailRemoveSubaddress: true,
      }),
    ]),
    phoneNumber: schema.string([
      rules.mobile({
        strict: true,
        locale: ['en-NG'],
      }),
    ]),
    homeAddress: schema.string({ trim: true }),
    relationship: schema.enum(Object.values(NextOfKInRelationships)),
  })

  public messages: CustomMessages = {
    'type.required': 'Next of kin type is required.',
    'type.enum': 'Please select a correct next of kin type.',
    'firstName.required': 'First name is required.',
    'firstName.alpha': 'First name should only contain alphabets.',
    'lastName.required': 'Last name is required.',
    'lastName.alpha': 'Last name should only contain alphabets.',
    'email.required': 'Email address is required.',
    'email.email': 'Email address must be a valid email address.',
    'phoneNumber.required': 'Phone number is required.',
    'phoneNumber.mobile':
      'Phone number must be a valid phone number and it must prefixed with country code.',
    'relationship.required': 'Relationship is required.',
    'relationship.enum': 'Please select a correct relationship.',
    'homeAddress.required': 'Home address is required.',
    'homeAddress.alpha': 'Home address should only contain alphanumeric characters.',
  }
}
