import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EmployeeLicenseOrCertificationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }),
    issuingOrganization: schema.string({ trim: true }),
    issueDate: schema.string(),
    expirationDate: schema.string.optional(),
    credentialId: schema.string.optional({ trim: true }),
    credentialUrl: schema.string.optional([rules.url()]),
  })

  public messages: CustomMessages = {
    'name.required': 'Name is required.',
    'issuingOrganization.required': 'Issuing Organization is required.',
    'issueDate.required': 'Issue Date is required.',
    'expirationDate.required': 'Expiration Date is required.',
    'credentialId.required': 'CredentialID is required.',
    'credentialUrl.url': 'Credential must be a valid url.',
  }
}
