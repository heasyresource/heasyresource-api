import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Statuses from 'App/Enums/Statuses'
import LeaveStatusEmail from 'App/Mailers/LeaveStatusEmail'
import User from 'App/Models/User'
import UserLeave from 'App/Models/UserLeave'
import AssignLeaveValidator from 'App/Validators/AssignLeaveValidator'
import RejectLeaveValidator from 'App/Validators/RejectLeaveValidator'

export default class UserLeavesController {
  public async fetchAllEmployeeLeaves({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const companyId = request.input('companyId', request.tenant.id)
    const { status, leaveTypeId } = request.qs()

    const users = await User.query().where('companyId', companyId).select('id')
    const userIds = users.map((user) => user.id)

    const employeeLeaves = await UserLeave.query()
      .whereIn('userId', userIds)
      .where('isDeleted', false)
      .if(status, (query) => {
        query.where('status', status)
      })
      .if(leaveTypeId, (query) => {
        query.where('leaveTypeId', leaveTypeId)
      })
      .preload('user')
      .preload('approvedByDetails')
      .preload('rejectedByDetails')
      .preload('leaveType')
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)

    return response.ok({
      status: 'Success',
      message: 'Fetched employee leaves successfully.',
      statusCode: 200,
      results: employeeLeaves,
    })
  }

  public async assignLeave({ request, response, params: { userId } }: HttpContextContract) {
    const validatedBody = await request.validate(AssignLeaveValidator)

    const { leaveTypeId, startDate, endDate, comments } = validatedBody

    await UserLeave.firstOrCreate(
      {
        userId,
        leaveTypeId,
        startDate,
        endDate,
      },
      {
        userId,
        leaveTypeId,
        startDate,
        endDate,
        comments,
        status: Statuses.PENDING,
      }
    )

    return response.ok({
      status: 'Success',
      message: 'Assigned leave to employee successfully.',
      statusCode: 200,
    })
  }

  public async approveLeave({
    request,
    response,
    params: { userleaveId },
    auth,
  }: HttpContextContract) {
    const user = await auth.use('jwt').authenticate()

    const leave = await UserLeave.query()
      .where('id', userleaveId)
      .preload('leaveType')
      .preload('user')
      .firstOrFail()

    leave.status = Statuses.APPROVED
    leave.approvedBy = user.id
    leave.rejectedBy = null
    await leave.save()

    await new LeaveStatusEmail(leave.user, request.tenant, leave).sendLater()

    return response.ok({
      status: 'Success',
      message: 'Approved leave successfully.',
      statusCode: 200,
    })
  }

  public async rejectLeave({
    request,
    response,
    params: { userleaveId },
    auth,
  }: HttpContextContract) {
    const user = await auth.use('jwt').authenticate()

    const validatedBody = await request.validate(RejectLeaveValidator)

    const { reasonForRejection } = validatedBody

    const leave = await UserLeave.query()
      .where('id', userleaveId)
      .preload('leaveType')
      .preload('user')
      .firstOrFail()
    leave.status = Statuses.REJECTED
    leave.reasonForRejection = reasonForRejection
    leave.rejectedBy = user.id
    leave.approvedBy = null
    await leave.save()

    await new LeaveStatusEmail(leave.user, request.tenant, leave).sendLater()

    return response.ok({
      status: 'Success',
      message: 'Rejected leave successfully.',
      statusCode: 200,
    })
  }

  public async requestLeave({ request, response, auth }: HttpContextContract) {
    const user = await auth.use('jwt').authenticate()

    const validatedBody = await request.validate(AssignLeaveValidator)

    const { leaveTypeId, startDate, endDate, comments } = validatedBody

    await UserLeave.firstOrCreate(
      {
        userId: user.id,
        leaveTypeId,
        startDate,
        endDate,
      },
      {
        userId: user.id,
        leaveTypeId,
        startDate,
        endDate,
        comments,
        status: Statuses.PENDING,
      }
    )

    return response.ok({
      status: 'Success',
      message: 'Request leave successfully.',
      statusCode: 200,
    })
  }

  public async fetchEmployeeLeaves({ request, response, auth }: HttpContextContract) {
    const user = await auth.use('jwt').authenticate()

    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const { status, leaveTypeId } = request.qs()

    const employeeLeaves = await UserLeave.query()
      .where('userId', user.id)
      .where('isDeleted', false)
      .if(status, (query) => {
        query.where('status', status)
      })
      .if(leaveTypeId, (query) => {
        query.where('leaveTypeId', leaveTypeId)
      })
      .preload('leaveType')
      .preload('approvedByDetails')
      .preload('rejectedByDetails')
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)

    return response.ok({
      status: 'Success',
      message: 'Fetched employee leaves successfully.',
      statusCode: 200,
      results: employeeLeaves,
    })
  }
}

module.exports = UserLeavesController
