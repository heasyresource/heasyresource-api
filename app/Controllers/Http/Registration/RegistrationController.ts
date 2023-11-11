import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Roles from 'App/Enums/Roles'
import Statuses from 'App/Enums/Statuses'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import Company from 'App/Models/Company'
import EmploymentInfo from 'App/Models/EmploymentInfo'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import CompanyInfoValidator from 'App/Validators/CompanyInfoValidator'
import CompleteCompanyRegistrationValidator from 'App/Validators/CompleteCompanyRegistrationValidator'
import RegistrationValidator from 'App/Validators/RegistrationValidator'
import randomstring from 'randomstring'
import Event from '@ioc:Adonis/Core/Event'

export default class RegistrationController {
  public async register({ request, response }: HttpContextContract) {
    const validatedBody = await request.validate(RegistrationValidator)

    const {
      companyName,
      companyEmail,
      companyWebsite,
      industryId,
      companyPhoneNumber,
      firstName,
      lastName,
      position,
      email,
      password,
    } = validatedBody

    const companyAdminRole = await Role.findBy('name', Roles.COMPANY_ADMIN)

    if (!companyAdminRole) {
      return response.badRequest({
        status: 'Bad Request',
        message: 'Registration failed, please try again later.',
        statusCode: 400,
      })
    }

    await Database.transaction(async (trx) => {
      const company = new Company()
      company.name = companyName
      company.email = companyEmail
      company.website = companyWebsite
      company.industryId = industryId
      company.phoneNumber = companyPhoneNumber
      company.status = Statuses.PENDING

      company.useTransaction(trx)
      await company.save()

      const user = new User()
      user.firstName = firstName
      user.lastName = lastName
      user.email = email
      user.password = password
      user.verificationCode = randomstring.generate({
        length: 6,
        charset: 'numeric',
      })
      user.roleId = companyAdminRole.id
      user.companyId = company.id

      user.useTransaction(trx)
      await user.save()

      const employmentInfo = new EmploymentInfo()
      employmentInfo.userId = user.id
      employmentInfo.position = position
      // employmentInfo.employeeId = 'HR-' + randomstring.generate({
      //   length: 6,
      //   charset: 'alphanumeric',
      //   capitalization: 'uppercase'
      // })
      
      employmentInfo.useTransaction(trx)
      await employmentInfo.save()

      await new VerifyEmail(user).sendLater()
      Event.emit('new:company', { companyId: company.id })
    })


    return response.created({
      status: 'Created',
      message: 'Registered successfully.',
      statusCode: 201,
    })
  }

  public async validateCompanyInfo({ request, response }: HttpContextContract) {
    await request.validate(CompanyInfoValidator)

    return response.ok({
      status: 'Success',
      message: 'Validated successfully.',
      statusCode: 200,
    })
  }

  public async completeCompanyRegistration({ auth, request, response }: HttpContextContract) {

    const validatedBody = await request.validate(CompleteCompanyRegistrationValidator)

    const {
      countryId,
      address,
      subdomain,
      emailDomain,
      logoUrl,
      companySizeId,
      autoGenerateEmployeeId,
      employeeIdFormat,
    } = validatedBody

    const user = await auth.use('jwt').authenticate()

    const company = await Company.query().where('id', user.companyId).where('isDeleted', false).first();

    if (!company) {
      return response.badRequest({
        status: 'Bad Request',
        message: 'Registration failed, please try again later.',
        statusCode: 400,
      })
    }

    company.countryId = countryId
    company.address = address
    company.subdomain = subdomain
    company.emailDomain = emailDomain
    company.logoUrl = logoUrl
    company.companySizeId = companySizeId
    company.autoGenerateEmployeeId = autoGenerateEmployeeId
    company.employeeIdFormat = JSON.stringify(employeeIdFormat)
    company.isCompletedRegistration = true
    await company.save()

    return response.ok({
      status: 'Success',
      message: 'Submit company information successfully.',
      statusCode: 200,
    })
  }
}
