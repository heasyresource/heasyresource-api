import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateDepartmentValidator {
  constructor(protected ctx: HttpContextContract) {}
  public refs = schema.refs({
		id: this.ctx.params.id || null
	})

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.unique({
        table: 'departments',
        column: 'name',
        where: {
          company_id: this.ctx.request.tenant.id,
          is_deleted: false,
        },
        whereNot: { id: this.refs.id },
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
        whereNot: { id: this.refs.id },
      }),
      rules.alphaNum(),
      rules.maxLength(4),
      rules.minLength(2),
    ]),
  })

  public messages: CustomMessages = {
    'name.required': 'Department name is required.',
    'name.alphaNum': 'Department name should only contain alphanumeric characters.',
    'name.unique': 'Department name address already exist.',
    'code.required': 'Department code is required.',
    'code.alphaNum': 'Department code should only contain alphanumeric characters.',
    'code.maxLength': 'Department code must not be more than to 4 characters.',
    'code.minLength': 'Department code must be up to atleast 2 characters.',
    'code.unique': 'Department code address already exist.',
  }
}
