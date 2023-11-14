import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JobCategory from 'App/Models/JobCategory'

export default class JobCategoriesController {
  public async fetchAllJobCategory({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const paginate = request.input('paginate', true)

    let jobCategory
    if (paginate === 'false' || paginate === false) {
      jobCategory = await JobCategory.query()
        .where('companyId', request.tenant.id)
        .where('isDeleted', false)
        .orderBy('createdAt', 'desc')
    } else {
      jobCategory = await JobCategory.query()
        .where('companyId', request.tenant.id)
        .where('isDeleted', false)
        .orderBy('createdAt', 'desc')
        .paginate(page, perPage)
    }

    return response.ok({
      status: 'Success',
      message: 'Fetched job category successfully.',
      statusCode: 200,
      results: jobCategory,
    })
  }
}
