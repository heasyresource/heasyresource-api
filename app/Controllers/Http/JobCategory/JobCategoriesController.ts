import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JobCategory from 'App/Models/JobCategory'
import JobCategoryValidator from 'App/Validators/JobCategoryValidator'

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

  public async createJobCategory({ request, response }: HttpContextContract) {
    const validatedBody = await request.validate(JobCategoryValidator)

    const { name } = validatedBody

    await JobCategory.create({
      name,
      companyId: request.tenant.id,
    })

    return response.ok({
      status: 'Success',
      message: 'Created Job category successfully',
      statusCode: 201,
    })
  }

  public async updateJobCategory({
    request,
    response,
    params: { jobCategoryId },
  }: HttpContextContract) {
    const jobCategory = await JobCategory.query()
      .where('id', jobCategoryId)
      .where('companyId', request.tenant.id)
      .firstOrFail()

    const validatedBody = await request.validate(JobCategoryValidator)

    await jobCategory.merge(validatedBody).save()

    return response.ok({
      status: 'Success',
      message: 'Updated Job category successfully',
      statusCode: 200,
    })
  }

  public async deleteJobCategory({
    request,
    response,
    params: { jobCategoryId },
  }: HttpContextContract) {
    const jobCategory = await JobCategory.query()
      .where('id', jobCategoryId)
      .where('companyId', request.tenant.id)
      .firstOrFail()

    await jobCategory.merge({ isDeleted: true }).save()

    return response.ok({
      status: 'Success',
      message: 'Deleted Job category successfully',
      statusCode: 200,
    })
  }
}
