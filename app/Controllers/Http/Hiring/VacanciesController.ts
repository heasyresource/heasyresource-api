import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Statuses from 'App/Enums/Statuses'
import JobApplicationEmail from 'App/Mailers/JobApplicationEmail'
import Applicant from 'App/Models/Applicant'
import Vacancy from 'App/Models/Vacancy'
import AddVacancyValidator from 'App/Validators/AddVacancyValidator'
import ApplicantValidator from 'App/Validators/ApplicantValidator'

export default class VacanciesController {
  public async getAllVacancies({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const companyId = request.input('companyId', request.tenant.id)
    const { isActive, isPublished, employmentTypeId, jobCategoryId, workMode, search } =
      request.qs()

    const vacancies = await Vacancy.query()
      .if(search, (query) => {
        query.whereILike('title', `%${search}%`)
      })
      .if(isActive, (query) => {
        query.where('isActive', isActive)
      })
      .if(isPublished, (query) => {
        query.where('isPublished', isPublished)
      })
      .if(employmentTypeId, (query) => {
        query.where('employmentTypeId', employmentTypeId)
      })
      .if(jobCategoryId, (query) => {
        query.where('jobCategoryId', jobCategoryId)
      })
      .if(workMode, (query) => {
        query.where('workMode', workMode)
      })
      .where('companyId', companyId)
      .where('isDeleted', false)
      .orderBy('createdAt', 'desc')
      .preload('jobCategory')
      .paginate(page, perPage)

    return response.ok({
      status: 'Success',
      message: 'Fetched all vacancies successfully',
      statusCode: 200,
      results: vacancies,
    })
  }

  public async getVacancyById({ request, response, params: { vacancyId } }: HttpContextContract) {
    const companyId = request.input('companyId', request.tenant.id)

    const vacancy = await Vacancy.query()
      .where('id', vacancyId)
      .where('companyId', companyId)
      .preload('employmentType')
      .preload('jobCategory')
      .firstOrFail()

    return response.ok({
      status: 'Success',
      message: 'Fetched vacancy successfully',
      statusCode: 200,
      result: vacancy,
    })
  }

  public async getVacancyBySlug({ request, response, params: { slug } }: HttpContextContract) {
    const companyId = request.input('companyId', request.tenant.id)

    const vacancy = await Vacancy.query()
      .where('slug', slug)
      .where('companyId', companyId)
      .preload('employmentType')
      .preload('jobCategory')
      .firstOrFail()

    return response.ok({
      status: 'Success',
      message: 'Fetched vacancy successfully',
      statusCode: 200,
      result: vacancy,
    })
  }

  public async createVacancy({ request, response }: HttpContextContract) {
    const validatedBody = await request.validate(AddVacancyValidator)

    const {
      title,
      jobCategoryId,
      employmentTypeId,
      workMode,
      location,
      description,
      hiringManager,
      numberOfPosition,
      isActive,
      isPublished,
    } = validatedBody

    await Vacancy.create({
      companyId: request.tenant.id,
      title,
      jobCategoryId,
      employmentTypeId,
      workMode,
      location,
      description,
      hiringManager,
      numberOfPosition,
      isActive,
      isPublished,
    })

    return response.created({
      status: 'Success',
      message: 'Created Vacancy successfully',
      statusCode: 201,
    })
  }

  public async updateVacancy({ request, response, params: { vacancyId } }: HttpContextContract) {
    const vacancy = await Vacancy.query()
      .where('id', vacancyId)
      .where('companyId', request.tenant.id)
      .firstOrFail()

    const validatedBody = await request.validate(AddVacancyValidator)

    await vacancy.merge(validatedBody).save()

    return response.ok({
      status: 'Success',
      message: 'Updated Vacancy successfully',
      statusCode: 200,
    })
  }

  public async deleteVacancy({ request, response, params: { vacancyId } }: HttpContextContract) {
    const vacancy = await Vacancy.query()
      .where('id', vacancyId)
      .where('companyId', request.tenant.id)
      .firstOrFail()

    await vacancy.merge({ isDeleted: true }).save()

    return response.ok({
      status: 'Success',
      message: 'Deleted Vacancy successfully',
      statusCode: 200,
    })
  }

  public async applyForVacancy({ request, response, params: { vacancyId } }: HttpContextContract) {
    const validatedBody = await request.validate(ApplicantValidator)

    const vacancy = await Vacancy.query()
      .where('id', vacancyId)
      .where('companyId', request.tenant.id)
      .firstOrFail()

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      city,
      stateId,
      countryId,
      resumeUrl,
    } = validatedBody

    const applicant = await Applicant.firstOrCreate(
      { email, vacancyId: vacancy.id },
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        city,
        stateId,
        countryId,
        resumeUrl,
        vacancyId: vacancy.id,
        status: Statuses.PENDING,
      }
    )

    await new JobApplicationEmail(applicant, request.tenant, vacancy).sendLater()

    return response.created({
      status: 'Success',
      message: 'Applied successfully',
      statusCode: 201,
    })
  }

  public async getAllPublishedVacancies({ request, response }: HttpContextContract) {
    const companyId = request.input('companyId', request.tenant.id)

    const vacancies = await Vacancy.query()
      .where('companyId', companyId)
      .where('isDeleted', false)
      .where('isActive', true)
      .where('isPublished', true)
      .orderBy('createdAt', 'desc')
      .preload('jobCategory')
      .preload('employmentType')

    return response.ok({
      status: 'Success',
      message: 'Fetched all published vacancies successfully',
      statusCode: 200,
      results: vacancies,
    })
  }
}

module.exports = VacanciesController
