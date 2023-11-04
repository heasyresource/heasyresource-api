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
    date: schema.string({},
      [
        rules.unique({
          table: 'holiday_types',
          column: 'date',
          where: {
            company_id: this.ctx.request.tenant.id,
          },
          whereNot: { id: this.refs.id },
        }),
      ]
    ),
    availability: schema.string({ trim: true }),
    comments: schema.string.optional({ trim: true }),
    isPaid: schema.boolean(),
    isFullDay: schema.boolean(),
  })

  public messages: CustomMessages = {
    'name.required': 'Holiday name is required.',
    'name.alphaNum': 'Holiday name should only contain alphanumeric characters.',
    'name.unique': 'Holiday name already exist.',
    'date.required': 'Holiday date is required.',
    'date.unique': 'Holiday date already exist.',
    'availability.required': 'Holiday availability is required.',
    'comments.alphaNum': 'Holiday comments should only contain alphanumeric characters.',
    'isPaid.required': 'Select either paid or unpaid.',
    'isPaid.boolean': 'Select either paid or unpaid.',
    'isFullDay.required': 'Select either full day or half day.',
    'isFullDay.boolean': 'Select either full day or half day.',
  }
}
