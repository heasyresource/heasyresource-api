import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateMultipleDepartmentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    departments: schema.array().members(
      schema.object().members({
        name: schema.string({ trim: true }, [
          rules.unique({
            table: 'departments',
            column: 'name',
            where: {
              company_id: this.ctx.request.tenant.id,
              is_deleted: false,
            },
          }),
          rules.alphaNum({
            allow: ['space', 'dash'],
          }),
        ]),
        code: schema.string({ trim: true }, [
          rules.unique({
            table: 'departments',
            column: 'code',
            where: {
              company_id: this.ctx.request.tenant.id,
            },
          }),
          rules.alphaNum(),
          rules.maxLength(4),
          rules.minLength(2),
        ]),
      })
    ),
  })

  public messages: CustomMessages = {
    'departments.*.name.required': 'Department name is required.',
    'departments.*.name.alphaNum': 'Department name should only contain alphanumeric characters.',
    'departments.*.name.unique': 'Department name address already exist.',
    'departments.*.code.required': 'Department code is required.',
    'departments.*.code.alphaNum': 'Department code should only contain alphanumeric characters.',
    'departments.*.code.maxLength': 'Department code must not be more than to 4 characters.',
    'departments.*.code.minLength': 'Department code must be up to atleast 2 characters.',
    'departments.*.code.unique': 'Department code address already exist.',
  }
}
