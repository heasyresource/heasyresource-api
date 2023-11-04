import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateLeaveTypeValidator {
  constructor(protected ctx: HttpContextContract) {}
  public refs = schema.refs({
    id: this.ctx.params.id || null,
  })

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.unique({
        table: 'leave_types',
        column: 'name',
        where: {
          company_id: this.ctx.request.tenant.id,
        },
        whereNot: { id: this.refs.id },
      }),
      rules.alphaNum({
        allow: ['space', 'dash'],
      }),
    ]),
    isPaid: schema.boolean(),
    comments: schema.string.optional({ trim: true }),
    availability: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {
    'name.required': 'Leave name is required.',
    'name.alphaNum': 'Leave name should only contain alphanumeric characters.',
    'name.unique': 'Leave name already exist.',
    'isPaid.required': 'Select either paid or unpaid.',
    'isPaid.boolean': 'Select either paid or unpaid.',
    'comments.alphaNum': 'Comments should only contain alphanumeric characters.',
    'availability.required': 'Holiday availability is required.',
  }
}
