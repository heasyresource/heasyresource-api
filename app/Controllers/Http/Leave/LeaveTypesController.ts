import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LeaveType from 'App/Models/LeaveType'
import CreateLeaveTypeValidator from 'App/Validators/CreateLeaveTypeValidator'

export default class LeaveTypesController {
  public async fetchAllLeaveTypes({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const paginate = request.input('paginate', true)

    let leaveTypes
    if (paginate === 'false' || paginate === false) {
      leaveTypes = await LeaveType.query()
        .where('companyId', request.tenant.id)
        .where('isDeleted', false)
        .orderBy('createdAt', 'desc')
    } else {
      leaveTypes = await LeaveType.query()
        .where('companyId', request.tenant.id)
        .where('isDeleted', false)
        .orderBy('createdAt', 'desc')
        .paginate(page, perPage)
    }
    return response.ok({
      status: 'Success',
      message: 'Fetched Leaves successfully.',
      statusCode: 200,
      results: leaveTypes,
    })
  }

  public async createLeaveType({ request, response }: HttpContextContract) {
    const validatedBody = await request.validate(CreateLeaveTypeValidator)

    const { name, isPaid, comments, availability } = validatedBody

    await LeaveType.firstOrCreate(
      { name, companyId: request.tenant.id },
      {
        name,
        availability,
        comments,
        isPaid,
        companyId: request.tenant.id,
      }
    )

    return response.created({
      status: 'Created',
      message: 'Created Leave successfully.',
      statusCode: 201,
    })
  }

  public async updateLeaveType({ params: { id }, request, response }: HttpContextContract) {
    const leaveType = await LeaveType.query()
      .where('id', id)
      .where('companyId', request.tenant.id)
      .firstOrFail()

    const validatedBody = await request.validate(CreateLeaveTypeValidator)

    await leaveType.merge(validatedBody).save()

    return response.ok({
      status: 'Success',
      message: 'Updated Leave successfully.',
      statusCode: 200,
    })
  }

  public async deleteLeaveType({ params: { id }, request, response }: HttpContextContract) {
    const leaveType = await LeaveType.query()
      .where('id', id)
      .where('companyId', request.tenant.id)
      .firstOrFail()

    await leaveType.merge({ isDeleted: true }).save()
    return response.ok({
      status: 'Success',
      message: 'Deleted Leave successfully.',
      statusCode: 200,
    })
  }
}

module.exports = LeaveTypesController
