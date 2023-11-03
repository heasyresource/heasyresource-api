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
        table: 'departments',
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
    isPaid: schema.boolean([
      rules.unique({
        table: 'leave_types',
        column: 'isPaid',
        where: {
          company_id: this.ctx.request.tenant.id,
        },
        whereNot: { id: this.refs.id },
      }),
    ]),
    comments: schema.string({ trim: true }, [
      rules.unique({
        table: 'leave_types',
        column: 'comments',
        where: {
          company_id: this.ctx.request.tenant.id,
        },
        whereNot: { id: this.refs.id },
      }),
      rules.alphaNum({
        allow: ['space', 'dash'],
      }),
    ]),
    availability: schema.string({ trim: true }, [
      rules.unique({
        table: 'leave_types',
        column: 'availability',
        where: {
          company_id: this.ctx.request.tenant.id,
        },
        whereNot: { id: this.refs.id },
      }),
      rules.alphaNum({
        allow: ['space', 'dash'],
      }),
    ]),
  })

  public messages: CustomMessages = {
    'name.required': 'Leave name is required.',
    'name.alphaNum': 'Leave name should only contain alphanumeric characters.',
    'name.unique': 'Leave name already exist.',
    'isPaid.required': 'isPaid is required and must be true or false.',
    'comments.alphaNum': 'Comments should only contain alphanumeric characters.',
    'availability.alphaNum': 'Availability should only contain alphanumeric characters.',
  }
}
