import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserLeaveValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    // userId: schema.string({ trim: true }),
    leaveTypeId: schema.string({ trim: true }),
    startDate: schema.string(),
    endDate: schema.string(),
    comments: schema.string({ trim: true }),
    status: schema.string({ trim: true }),
    approvedBy: schema.string(),
    reasonForRejection: schema.string({ trim: true }),
    rejectedBy: schema.string.optional(),
  })

  public messages: CustomMessages = {
    // 'userId.required': 'User is required',
    'leaveTypeId.required': 'Leave Type is required',
    'startDate.required': 'Start Date is required',
    'endDate.required': 'End Date is required',
    'comments.required': 'Comment is required',
    'status.required': 'Status is required',
    'approvedBy.required': 'Approval is required',
    'reasonForRejection.required': 'Reason for Rejection is required',
    'rejectedBy.required': 'Rejection status is required',
  }
}
