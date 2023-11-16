import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateCompanyValidator {
  constructor(protected ctx: HttpContextContract) {}
  public refs = schema.refs({
    id: this.ctx.params.companyId,
  })

  public schema = schema.create({
    address: schema.string({ trim: true }),
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
    emailDomain: schema.string.optional({ trim: true }, [
      rules.regex(
        /^@[a-zA-Z0-9][a-zA-Z0-9\.-]+[a-zA-Z0-9]\.[a-zA-Z]{2,}(,@[a-zA-Z0-9][a-zA-Z0-9\.-]+[a-zA-Z0-9]\.[a-zA-Z]{2,})*$/
      ),
    ]),
    companySizeId: schema.string({ trim: true }, [
      rules.uuid(),
      rules.exists({
        table: 'company_sizes',
        column: 'id',
        where: {
          is_deleted: false,
        },
      }),
    ]),
    autoGenerateEmployeeId: schema.boolean(),
    employeeIdFormat: schema.array
      .optional([rules.requiredWhen('autoGenerateEmployeeId', '=', true)])
      .members(
        schema.string({ trim: true }, [
          rules.alpha({
            allow: ['space'],
          }),
        ])
      ),
    logoUrl: schema.string([rules.url()]),
    companyEmail: schema.string({ trim: true }, [
      rules.email(),
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: true,
        gmailRemoveSubaddress: true,
      }),
      rules.unique({ table: 'companies', column: 'email', whereNot: { id: this.refs.id } }),
    ]),
    companyWebsite: schema.string({ trim: true }, [
      rules.url(),
      rules.unique({ table: 'companies', column: 'website', whereNot: { id: this.refs.id } }),
    ]),
    industryId: schema.string({ trim: true }, [
      rules.uuid(),
      rules.exists({
        table: 'industries',
        column: 'id',
        where: {
          is_deleted: false,
        },
      }),
    ]),
    companyPhoneNumber: schema.string([
      rules.mobile({
        strict: true,
        locale: ['en-NG'],
      }),
      rules.unique({ table: 'companies', column: 'phone_number', whereNot: { id: this.refs.id } }),
    ]),
  })

  public messages: CustomMessages = {
    'address.required': 'Company name is required.',
    'countryId.required': 'Please select a valid country.',
    'countryId.uuid': 'Please select a valid country.',
    'countryId.exists': 'Please select a valid country.',
    'emailDomain.regex':
      'Email domain value is not a valid email domain. Please enter valid domains with the format "@domain.com" separated by a comma.',
    'companySizeId.required': 'Please select a valid company size.',
    'companySizeId.uuid': 'Please select a valid company size.',
    'companySizeId.exists': 'Please select a valid company size.',
    'autoGenerateEmployeeId.required': 'Auto generate employeeID is required.',
    'autoGenerateEmployeeId.boolean': 'This must be either true or false.',
    'employeeIdFormat.required': 'EmployeeIDFormat is required.',
    'employeeIdFormat.array': 'EmployeeIDFormat is required.',
    'logoUrl.required': 'Logo is required.',
    'logoUrl.url': 'Logo must be a valid url.',
    'companyEmail.required': 'Company email address is required.',
    'companyEmail.email': 'Company email address must be a valid email address.',
    'companyEmail.unique': 'Company email address already exist.',
    'companyWebsite.required': 'Company website is required.',
    'companyWebsite.unique': 'Company website already exist.',
    'companyWebsite.url': 'Company website must be a valid url.',
    'industryId.required': 'Please select a valid field/industry.',
    'industryId.uuid': 'Please select a valid field/industry.',
    'industryId.exists': 'Please select a valid field/industry.',
    'companyPhoneNumber.required': 'Phone number is required.',
    'companyPhoneNumber.mobile':
      'Phone number must be a valid phone number and it must prefixed with country code.',
    'companyPhoneNumber.unique': 'This phone number already exist.',
  }
}
