import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Statuses from 'App/Enums/Statuses'
import UserLeave from 'App/Models/UserLeave'
import UserLeaveValidator from 'App/Validators/UserLeaveValidator'

export default class UserLeavesController {
  public async fetchAllUserLeaves({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    const userLeaves = await UserLeave.query()
      .where('companyId', request.tenant.id)
      .where('isDeleted', false)
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)

    return response.ok({
      status: 'Success',
      message: 'Fetched User Leaves successfully',
      statusCode: 200,
      results: userLeaves,
    })
  }

  public async assignLeave({ request, response, params: { userId } }: HttpContextContract) {
    const validatedBody = await request.validate(UserLeaveValidator)

    const {
      leaveTypeId,
      startDate,
      endDate,
      comments,
      status,
      approvedBy,
      reasonForRejection,
      rejectedBy,
    } = validatedBody

    await UserLeave.firstOrCreate(
      {
        userId,
        leaveTypeId,
        startDate,
        endDate,
        comments,
        status,
        approvedBy,
        reasonForRejection,
        rejectedBy,
      },
      {
        userId,
        leaveTypeId,
        startDate,
        endDate,
        comments,
        status,
        approvedBy,
        reasonForRejection,
        rejectedBy,
      }
    )

    response.ok({
      status: 'Success',
      message: 'Assigned leave to user successfully',
      statusCode: 200,
    })
  }

  public async approveLeave({
    request,
    response,
    params: { leaveId, userId },
  }: HttpContextContract) {
    const validatedBody = await request.validate(UserLeaveValidator)

    const { approvedBy } = validatedBody

    const leave = await UserLeave.query().where('id', leaveId).where('userId', userId).firstOrFail()

    leave.status = Statuses.APPROVED
    leave.approvedBy = approvedBy
    await leave.save()

    return response.ok({
      status: 'Success',
      message: 'Leave Approved',
      statusCode: 200,
    })
  }

  public async rejectLeave({
    request,
    response,
    params: { userId, leaveId },
  }: HttpContextContract) {
    const validatedBody = await request.validate(UserLeaveValidator)

    const { reasonForRejection, rejectedBy } = validatedBody

    const leave = await UserLeave.query().where('id', leaveId).where('userId', userId).firstOrFail()
    leave.status = Statuses.REJECTED
    await leave.save()

    await leave.merge({ reasonForRejection: reasonForRejection, rejectedBy: rejectedBy }).save()

    return response.ok({
      status: 'Success',
      message: 'Rejected Leave successfully',
      statusCode: 200,
    })
  }
}
