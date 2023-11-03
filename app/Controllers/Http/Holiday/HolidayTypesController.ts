import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HolidayType from 'App/Models/HolidayType'
import CreateHolidayTypeValidator from 'App/Validators/CreateHolidayTypeValidator'

export default class HolidayTypesController {
  public async fetchAllHoliday({ request, response }: HttpContextContract) {
    const holiday = await HolidayType.query().where('companyId', request.tenant.id)

    return response.ok({
      status: 'Success',
      message: 'Fetched holiday successfully.',
      statusCode: 200,
      results: holiday,
    })
  }

  public async createHoliday({ request, response }: HttpContextContract) {
    const validatedBody = await request.validate(CreateHolidayTypeValidator)

    const { name, date, availability, comments, isPaid, isFullDay } = validatedBody

    await HolidayType.firstOrCreate({
      name,
      date,
      availability,
      comments,
      isPaid,
      isFullDay,
      companyId: request.tenant.id,
    })

    return response.created({
      status: 'Created',
      message: 'Created Holiday successfully.',
      statusCode: 201,
    })
  }

  public async updateHoliday({ params: { id }, request, response }: HttpContextContract) {
    const holiday = await HolidayType.query()
      .where('id', id)
      .where('companyId', request.tenant.id)
      .firstOrFail()

    const validatedBody = await request.validate(CreateHolidayTypeValidator)

    await holiday.merge(validatedBody).save()

    return response.ok({
      status: 'Success',
      message: 'Updated Holiday successfully.',
      statusCode: 200,
    })
  }

  public async deleteHoliday({ params: { id }, request, response }: HttpContextContract) {
    const holiday = await HolidayType.query()
      .where('id', id)
      .where('companyId', request.tenant.id)
      .firstOrFail()

    await holiday.merge({ isDeleted: true }).save()
    return response.ok({
      status: 'Success',
      message: 'Deleted holiday successfully.',
      statusCode: 200,
    })
  }
}

module.exports = HolidayTypesController
