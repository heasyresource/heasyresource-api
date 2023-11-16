import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ComponentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.params.componentId || null,
  })

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.unique({
        table: 'components',
        column: 'name',
        where: {
          company_id: this.ctx.request.tenant.id,
          is_deleted: false,
        },
        whereNot: { id: this.refs.id },
      }),
    ]),
    type: schema.string({ trim: true }),
    // companyId: schema.string({ trim: true }),
    isFixed: schema.boolean(),
    rate: schema.string({ trim: true }),
    amount: schema.number(),
    frequency: schema.string({ trim: true }),
    comments: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {
    'name.required': 'Component name is required',
    'name.unique': 'Component name already exists',
    'type.required': 'Component type is required',
    'isFixed.required': 'Please select a valid option',
    'rate.required': 'Rate is required',
    'amount.required': 'Amount is required',
    'frequency.required': 'Frequency is required',
    'comments.required': 'Comments are required',
  }
}
