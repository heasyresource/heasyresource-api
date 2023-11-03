import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateHolidayTypeValidator {
  constructor(protected ctx: HttpContextContract) {}
  public refs = schema.refs({
    id: this.ctx.params.id || null,
  })

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.unique({
        table: 'holiday_types',
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
    date: schema.date({ format: Date }, [
      rules.unique({
        table: 'holiday_types',
        column: 'date',
        where: {
          company_id: this.ctx.request.tenant.id,
        },
        whereNot: { id: this.refs.id },
      }),
    ]),
    availability: schema.string({ trim: true }, [
      rules.unique({
        table: 'holiday_types',
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
    comments: schema.string({ trim: true }, [
      rules.unique({
        table: 'holiday_types',
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
    isPaid: schema.boolean([
      rules.unique({
        table: 'holiday_types',
        column: 'isPaid',
        where: {
          company_id: this.ctx.request.tenant.id,
        },
        whereNot: { id: this.refs.id },
      }),
    ]),
    isFullDay: schema.boolean([
      rules.unique({
        table: 'leave_types',
        column: 'isFullDay',
        where: {
          company_id: this.ctx.request.tenant.id,
        },
        whereNot: { id: this.refs.id },
      }),
    ]),
  })

  public messages: CustomMessages = {
    'name.required': 'Holiday name is required.',
    'name.alphaNum': 'Holiday name should only contain alphanumeric characters.',
    'name.unique': 'Holiday name already exist.',
    'date.required': 'Holiday date is required.',
    'date.unique': 'Holiday date already exist.',
    'availability.alphaNum': 'Holiday availability should only contain alphanumeric characters.',
    'comments.alphaNum': 'Holiday comments should only contain alphanumeric characters.',
    'isPaid.required': 'Holiday isPaid status is required and must be true or false.',
    'isFullDay.required': 'Holiday isFullDay status is required and must be true or false.',
  }
}
