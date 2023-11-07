import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Genders from 'App/Enums/Genders'
import MaritalStatuses from 'App/Enums/MaritalStatuses'

export default class EmployeePersonalDetailsValidator {
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
    nationality: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['space', 'dash'],
      }),
    ]),
    dateOfBirth: schema.string(),
    employeeID: schema.string.optional({ trim: true }, [
      rules.alphaNum({
        allow: ['dash'],
      }),
    ]),
    maritalStatus: schema.enum(Object.values(MaritalStatuses)),
    gender: schema.enum(Object.values(Genders)),
  })

  public messages: CustomMessages = {
    'firstName.required': 'First name is required.',
    'firstName.alpha': 'First name should only contain alphabets.',
    'middleName.required': 'Middle name is required.',
    'middleName.alpha': 'Middle name should only contain alphabets.',
    'lastName.required': 'Last name is required.',
    'lastName.alpha': 'Last name should only contain alphabets.',
    'gender.required': 'Gender is required.',
    'gender.enum': 'Please select a correct gender.',
    'maritalStatus.required': 'Marital Status is required.',
    'maritalStatus.enum': 'Please select a correct marital status.',
    'nationality.required': 'Nationality is required.',
    'nationality.alpha': 'Nationality should only contain alphabets.',
    'dateOfBirth.required': 'Date Of Birth is required.',
  }
}
