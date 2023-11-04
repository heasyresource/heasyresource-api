import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CompleteCompanyRegistrationValidator {
  constructor(protected ctx: HttpContextContract) {}
  public refs = schema.refs({
    id: this.ctx.auth.user?.companyId,
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
    subdomain: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['dash'],
      }),
      rules.unique({ table: 'companies', column: 'subdomain', whereNot: { id: this.refs.id } }),
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
    employeeIdFormat: schema.array.optional([
      rules.requiredWhen('autoGenerateEmployeeId', '=', true)
    ]).members(
      schema.string({ trim: true }, [
        rules.alpha({
          allow: ['space'],
        }),
      ])
    ),
    logoUrl: schema.string([rules.url()]),
  })

  public messages: CustomMessages = {
    'address.required': 'Company name is required.',
    'countryId.required': 'Please select a valid country.',
    'countryId.uuid': 'Please select a valid country.',
    'countryId.exists': 'Please select a valid country.',
    'subdomain.required': 'Subdomain is required.',
    'subdomain.unique': 'Subdomain already exist.',
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
  }
}
