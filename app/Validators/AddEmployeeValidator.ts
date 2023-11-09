import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Genders from 'App/Enums/Genders'

export default class AddEmployeeValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    firstName: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['space', 'dash'],
      }),
    ]),
    middleName: schema.string.optional({ trim: true }, [
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
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    position: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['space', 'dash'],
      }),
    ]),
    employeeID: schema.string.optional({ trim: true }, [
      rules.alphaNum({
        allow: ['dash'],
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
    gender: schema.enum(Object.values(Genders)),
    logoUrl: schema.string.optional([rules.url()])
  })

  public messages: CustomMessages = {
    'firstName.required': 'First name is required.',
    'firstName.alpha': 'First name should only contain alphabets.',
    'middleName.required': 'Middle name is required.',
    'middleName.alpha': 'Middle name should only contain alphabets.',
    'lastName.required': 'Last name is required.',
    'lastName.alpha': 'Last name should only contain alphabets.',
    'email.required': 'Email address is required.',
    'email.email': 'Email address must be a valid email address.',
    'email.unique': 'This email address already exist.',
    'departmentId.required': 'Please select a valid department.',
    'departmentId.uuid': 'Please select a valid department.',
    'departmentId.exists': 'Please select a valid department.',
    'gender.required': 'Gender is required.',
    'gender.enum': 'Please select a correct gender.',
    'position.required': 'Position is required.',
    'position.alpha': 'Position should only contain alphabets.',
    'logoUrl.url': 'Logo must be a valid url.',
  }
}
