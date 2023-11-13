import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Applicant from 'App/Models/Applicant'
import Vacany from 'App/Models/Vacany'
import AddVacancyValidator from 'App/Validators/AddVacancyValidator'
import ApplicantValidator from 'App/Validators/ApplicantValidator'

export default class VacanciesController {
  public async getAllVacancies({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    const vacancies = await Vacany.query()
      .where('companyId', request.tenant.id)
      .where('isDeleted', false)
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)

    return response.ok({
      status: 'Success',
      message: 'Fetched all vacancies successfully',
      statusCode: 200,
      results: vacancies,
    })
  }

  public async getVacancyById({ request, response, params: { vacancyId } }: HttpContextContract) {
    const vacancy = await Vacany.query()
      .where('id', vacancyId)
      .where('companyId', request.tenant.id)
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
      slug,
      jobCategoryId,
      employmentTypeId,
      workMode,
      location,
      description,
      hiringManager,
      numberOfPosition,
      link,
      isActive,
      isPublished,
    } = validatedBody

    await Vacany.firstOrCreate(
      { title, slug, companyId: request.tenant.id },
      {
        title,
        slug,
        jobCategoryId,
        employmentTypeId,
        workMode,
        location,
        description,
        hiringManager,
        numberOfPosition,
        link,
        isActive,
        isPublished,
        companyId: request.tenant.id,
      }
    )

    return response.created({
      status: 'Success',
      message: 'Created Vacancy successfully',
      statusCode: 201,
    })
  }

  public async updateVacancy({ request, response, params: { id } }: HttpContextContract) {
    const vacancy = await Vacany.query()
      .where('id', id)
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

  public async deleteVacancy({ request, response, params: { id } }: HttpContextContract) {
    const vacancy = await Vacany.query()
      .where('id', id)
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
      reason,
    } = validatedBody

    await Applicant.firstOrCreate(
      { firstName, lastName, vacancyId: vacancyId },
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
        reason,
        vacancyId: vacancyId,
      }
    )

    return response.created({
      status: 'Success',
      message: 'Applied successfully',
      statusCode: 201,
    })
  }
}

module.exports = VacanciesController
