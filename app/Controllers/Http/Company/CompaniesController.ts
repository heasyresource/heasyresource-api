import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'

export default class CompaniesController {
  public async getCompanyById({ params: { companyId }, response }: HttpContextContract) {
    const company = await Company.query().where('id', companyId).first()

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
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)
    return response.ok({
      status: 'Success',
      message: 'Fetched companies successfully.',
      statusCode: 200,
      results: companies,
    })
  }
}
