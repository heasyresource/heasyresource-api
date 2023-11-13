import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AssignLeaveValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    leaveTypeId: schema.string({ trim: true }),
    startDate: schema.string(),
    endDate: schema.string(),
    comments: schema.string.optional({ trim: true }),
  })

  public messages: CustomMessages = {
    'leaveTypeId.required': 'Leave Type is required.',
    'startDate.required': 'Start Date is required.',
    'endDate.required': 'End Date is required.',
  }
}
