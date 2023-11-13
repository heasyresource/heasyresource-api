import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AssignLeaveValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    leaveTypeId: schema.string({ trim: true },[
      rules.uuid(),
      rules.exists({
        table: 'leave_types',
        column: 'id',
        where: {
          is_deleted: false,
        },
      }),
    ]),
    startDate: schema.string(),
    endDate: schema.string(),
    comments: schema.string.optional({ trim: true }),
  })

  public messages: CustomMessages = {
    'leaveTypeId.required': 'Leave Type is required.',
    'leaveTypeId.uuid': 'Please select a valid leave type.',
    'leaveTypeId.exists': 'Please select a valid leave type.',
    'startDate.required': 'Start Date is required.',
    'endDate.required': 'End Date is required.',
  }
}
