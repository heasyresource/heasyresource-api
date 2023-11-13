import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Statuses from 'App/Enums/Statuses'
import User from 'App/Models/User'
import UserLeave from 'App/Models/UserLeave'
import AssignLeaveValidator from 'App/Validators/AssignLeaveValidator'
import RejectLeaveValidator from 'App/Validators/RejectLeaveValidator'

export default class UserLeavesController {
  public async fetchAllEmployeeLeaves({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const companyId = request.input('companyId', request.tenant.id)

    const users = await User.query().where('companyId', companyId).select('id')
    const userIds = users.map((user) => user.id)

    const employeeLeaves = await UserLeave.query()
      .whereIn('userId', userIds)
      .where('isDeleted', false)
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

  public async approveLeave({ response, params: { userleaveId }, auth }: HttpContextContract) {
    const user = await auth.use('jwt').authenticate()

    const leave = await UserLeave.query().where('id', userleaveId).firstOrFail()

    leave.status = Statuses.APPROVED
    leave.approvedBy = user.id
    leave.rejectedBy = null
    await leave.save()

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

    const leave = await UserLeave.query().where('id', userleaveId).firstOrFail()
    leave.status = Statuses.REJECTED
    leave.reasonForRejection = reasonForRejection
    leave.rejectedBy = user.id
    leave.approvedBy = null
    await leave.save()

    return response.ok({
      status: 'Success',
      message: 'Rejected leave successfully.',
      statusCode: 200,
    })
  }
}
