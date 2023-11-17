import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Statuses from 'App/Enums/Statuses'
import Company from 'App/Models/Company'
import CompanyStatusValidator from 'App/Validators/CompanyStatusValidator'
import UpdateCompanyValidator from 'App/Validators/UpdateCompanyValidator'

export default class CompaniesController {
  public async getCompanyById({ params: { companyId }, response }: HttpContextContract) {
    const company = await Company.query()
      .where('id', companyId)
      .preload('country')
      .preload('companySize')
      .preload('industry')
      .first()

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
    const { search, status } = request.qs()

    const defaultCompany = 'Heasy Resource';

    const companies = await Company.query()
      .if(search, (query) => {
        query.whereILike('name', `%${search}%`)
      })
      .if(status, (query) => {
        query.where('status', status)
      })
      .whereNot('name', defaultCompany)
      .where('isDeleted', false)
      .preload('country')
      .preload('companySize')
      .preload('industry')
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)
    return response.ok({
      status: 'Success',
      message: 'Fetched companies successfully.',
      statusCode: 200,
      results: companies,
    })
  }

  public async updateCompanyStatus({
    params: { companyId },
    request,
    response,
  }: HttpContextContract) {
    const company = await Company.query().where('id', companyId).firstOrFail()
    const { status } = await request.validate(CompanyStatusValidator)

    const oldStatus = company.status
    company.status = status
    company.isActive = status === Statuses.APPROVED
    await company.save()

    if (oldStatus === Statuses.PENDING && status === Statuses.APPROVED) {
      // Send Mail
    }

    return response.ok({
      status: 'Success',
      message: 'Update company status successfully.',
      statusCode: 200,
    })
  }

  public async updateCompanyDetails({
    params: { companyId },
    response,
    request,
  }: HttpContextContract) {
    const company = await Company.query().where('id', companyId).firstOrFail()

    const validatedBody = await request.validate(UpdateCompanyValidator)

    const {
      address,
      countryId,
      emailDomain,
      companySizeId,
      autoGenerateEmployeeId,
      employeeIdFormat,
      logoUrl,
      companyEmail: email,
      companyWebsite: website,
      industryId,
      companyPhoneNumber: phoneNumber,
    } = validatedBody
    await company
      .merge({
        address,
        countryId,
        emailDomain,
        companySizeId,
        autoGenerateEmployeeId,
        employeeIdFormat: JSON.stringify(employeeIdFormat),
        logoUrl,
        email,
        website,
        industryId,
        phoneNumber,
      })
      .save()

    return response.ok({
      status: 'Success',
      message: 'Updated company successfully.',
      statusCode: 200,
    })
  }
}
