import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Statuses from 'App/Enums/Statuses'
import Company from 'App/Models/Company'
import CompanyStatusValidator from 'App/Validators/CompanyStatusValidator'

export default class CompaniesController {
  public async getCompanyById({ params: { companyId }, response }: HttpContextContract) {
    const company = await Company.query().where('id', companyId).preload('country').preload('companySize').preload('industry').first()

    return response.ok({
      status: 'Success',
      message: 'Fetched company successfully.',
      statusCode: 200,
      results: company,
    })
  }

  public async getCompanyBySubdomain({ params: { subdomain }, response }: HttpContextContract) {
    const company = await Company.query().where('subdomain', subdomain).first()

    return response.ok({
      status: 'Success',
      message: 'Fetched company successfully.',
      statusCode: 200,
      results: company,
    })
  }

  public async fetchAllCompanies({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    const companies = await Company.query()
      .where('isDeleted', false)
      .preload('country').preload('companySize').preload('industry')
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)
    return response.ok({
      status: 'Success',
      message: 'Fetched companies successfully.',
      statusCode: 200,
      results: companies,
    })
  }

  public async updateCompanyStatus({ params: { companyId }, request, response }: HttpContextContract) {
    const company = await Company.query().where('id', companyId).firstOrFail()
    const { status } = await request.validate(CompanyStatusValidator)

    const oldStatus = company.status
    company.status = status
    company.isActive = status === Statuses.APPROVED ? true : false 

    if (oldStatus === Statuses.PENDING && status === Statuses.APPROVED) {
      // Send Mail
    }

    return response.ok({
      status: 'Success',
      message: 'Update company status successfully.',
      statusCode: 200
    })
  }
}
