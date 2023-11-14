import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Applicant from 'App/Models/Applicant'
import ApplicantValidator from 'App/Validators/ApplicantValidator'
import RejectApplicantValidator from 'App/Validators/RejectApplicantValidator'
import ShortlistApplicantValidator from 'App/Validators/ShortlistApplicantValidator'
import Statuses from 'App/Enums/Statuses'

export default class ApplicantsController {
  public async getAllApplicants({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    const applicants = await Applicant.query()
      .where('isDeleted', false)
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)

    return response.ok({
      status: 'Success',
      message: 'Fetched all applicants successfully',
      statusCode: 200,
      results: applicants,
    })
  }

  public async getApplicantById({ response, params: { id } }: HttpContextContract) {
    const applicant = await Applicant.query().where('id', id).firstOrFail()

    return response.ok({
      status: 'Success',
      message: 'Fetched applicant successfully',
      statusCode: 200,
      result: applicant,
    })
  }

  public async createApplicant({ request, response, params: { vacancyId } }: HttpContextContract) {
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
    } = validatedBody

    await Applicant.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      city,
      stateId,
      countryId,
      resumeUrl,
      vacancyId,
      status: Statuses.PENDING,
    })

    return response.ok({
      status: 'Created',
      message: 'Created Applicant successfully',
      statusCode: 201,
    })
  }

  public async updateApplicant({
    request,
    response,
    params: { applicantId },
  }: HttpContextContract) {
    const applicant = await Applicant.query().where('id', applicantId).firstOrFail()

    const validatedBody = await request.validate(ApplicantValidator)

    await applicant.merge(validatedBody).save()

    return response.ok({
      status: 'Success',
      message: 'Update Applicant successfully',
      statusCode: 200,
    })
  }

  public async deleteApplicant({ response, params: { applicantId } }: HttpContextContract) {
    const applicant = await Applicant.query().where('id', applicantId).firstOrFail()

    await applicant.merge({ isDeleted: true }).save()

    return response.ok({
      status: 'Success',
      message: 'Deleted Applicant successfully',
      statusCode: 200,
    })
  }

  public async rejectApplicant({
    request,
    response,
    params: { applicantId },
  }: HttpContextContract) {
    const applicant = await Applicant.query().where('id', applicantId).firstOrFail()

    const validatedBody = await request.validate(RejectApplicantValidator)

    const { reason } = validatedBody

    applicant.status = Statuses.REJECTED
    applicant.reason = reason
    await applicant.save()

    return response.ok({
      status: 'Success',
      message: 'Rejected applicant successfully',
      statusCode: 200,
    })
  }

  public async shortlistApplicant({
    request,
    response,
    params: { applicantId },
  }: HttpContextContract) {
    const applicant = await Applicant.query().where('id', applicantId).firstOrFail()

    const validatedBody = await request.validate(ShortlistApplicantValidator)

    const { reason } = validatedBody

    applicant.status = Statuses.SHORTLISTED
    applicant.reason = reason
    applicant.save()

    return response.ok({
      status: 'Success',
      message: 'Shortlisted applicant successfully',
      statusCode: 200,
    })
  }
}
