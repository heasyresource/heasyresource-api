import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ComponentTypes from 'App/Enums/ComponentTypes'
import Frequency from 'App/Enums/Frequency'

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
    type: schema.enum(Object.values(ComponentTypes)),
    isFixed: schema.boolean(),
    rate: schema.string.optional({ trim: true }, [rules.requiredWhen('isFixed', '=', false)]),
    amount: schema.number.optional([rules.requiredWhen('isFixed', '=', true)]),
    frequency: schema.enum(Object.values(Frequency)),
    comments: schema.string.optional({ trim: true }),
  })

  public messages: CustomMessages = {
    'name.required': 'Component name is required.',
    'name.unique': 'Component name already exists.',
    'type.required': 'Component type is required.',
    'type.enum': 'Please select a correct type.',
    'isFixed.required': 'Please select a valid option.',
    'rate.requiredWhen': 'Rate is required.',
    'amount.requiredWhen': 'Amount is required.',
    'frequency.required': 'Frequency is required.',
    'frequency.enum': 'Please select a correct frequency.',
  }
}
