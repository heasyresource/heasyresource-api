import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EmployeeLicenseOrCertificationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    // userId: schema.string({ trim: true }, [
    //   rules.uuid(),
    //   rules.exists({
    //     table: 'users',
    //     column: 'id',
    //     where: {
    //       is_deleted: false,
    //     },
    //   }),
    // ]),
    name: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['space', 'dash'],
      }),
    ]),
    issuingOrganization: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['space', 'dash'],
      }),
    ]),
    issueDate: schema.date(),
    expirationDate: schema.date(),
    credentialId: schema.string({ trim: true }, [
      rules.alphaNum({
        allow: ['dash'],
      }),
    ]),
    credentialUrl: schema.string.optional([rules.url()]),
  })

  public messages: CustomMessages = {
    // 'userId.required': 'Please select a valid user .',
    // 'userId.uuid': 'Please select a valid user.',
    // 'userId.exists': 'Please select a valid user.',
    'name.required': 'Name is required.',
    'name.alpha': 'Name should only contain alphabets',
    'issuingOrganization.required': 'Issuing Organization is required.',
    'issuingOrganization.alpha': 'Issuing Organization should only contain alphabets',
    'issueDate.required': 'Issue Date is required.',
    'expirationDate.required': 'Expiration Date is required.',
    'credentialId.required': 'CredentialID is required.',
    'credentialId.alphaNum': 'CredentialID should only contain alphanumeric characters.',
    'credentialUrl.url': 'Credential must be a valid url.',
  }
}
