import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Roles from 'App/Enums/Roles'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import Company from 'App/Models/Company'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import RegistrationValidator from 'App/Validators/RegistrationValidator'
import randomstring from 'randomstring'

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
      
      await new VerifyEmail(user, company).sendLater()
    })


    return response.created({
      status: 'Created',
      message: 'Registered successfully.',
      statusCode: 201,
    })
  }
}
