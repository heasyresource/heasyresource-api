import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AddEmployeeValidator from 'App/Validators/AddEmployeeValidator'
import Roles from 'App/Enums/Roles'
import Role from 'App/Models/Role'
import randomstring from 'randomstring'
import User from 'App/Models/User'
import EmploymentInfo from 'App/Models/EmploymentInfo'
import Database from '@ioc:Adonis/Lucid/Database'
import EmployeeService from 'App/Services/EmployeeService'
import EmployeePersonalDetailsValidator from 'App/Validators/EmployeePersonalDetailsValidator'
import ContactDetail from 'App/Models/ContactDetail'
import EmployeeContactDetailsValidator from 'App/Validators/EmployeeContactDetailsValidator'
import NextOfKin from 'App/Models/NextOfKin'
import EmployeeNextOfKinValidator from 'App/Validators/EmployeeNextOfKinValidator'
import EmployeeInfoValidator from 'App/Validators/EmployeeInfoValidator'

export default class EmployeesController {
  public async addEmployee({ request, response }: HttpContextContract) {
    const validatedBody = await request.validate(AddEmployeeValidator)

    const { firstName, middleName, lastName, employeeID, position, departmentId, email, gender, logoUrl } =
      validatedBody

    if (!EmployeeService.checkValidEmailDomain(request.tenant.emailDomain, email)) {
      return response.badRequest({
        status: 'Bad Request',
        message: 'Could not add employee with this email domain.',
        statusCode: 400,
      })
    }
    const employeeRole = await Role.findBy('name', Roles.EMPLOYEE)

    if (!employeeRole) {
      return response.badRequest({
        status: 'Bad Request',
        message: 'Failed, please try again later.',
        statusCode: 400,
      })
    }

    const generatedPassword = randomstring.generate({
      length: 10,
      charset: ['alphanumeric', '?', '@', '!'],
    })

    // console.log({ generatedPassword })

    await Database.transaction(async (trx) => {
      const user = new User()
      user.firstName = firstName
      user.middleName = middleName
      user.lastName = lastName
      user.email = email
      user.gender = gender
      user.password = generatedPassword
      user.isActive = true
      user.isVerified = true
      user.roleId = employeeRole.id
      user.companyId = request.tenant.id
      user.logoUrl = logoUrl

      user.useTransaction(trx)
      await user.save()

      //   await new VerifyEmail(user).sendLater()

      const employmentInfo = new EmploymentInfo()
      employmentInfo.userId = user.id
      employmentInfo.position = position
      employmentInfo.departmentId = departmentId
      employmentInfo.employeeId = !request.tenant.autoGenerateEmployeeId
        ? employeeID
        : await EmployeeService.generateEmployeeId(
            request.tenant.employeeIdFormat,
            departmentId,
            request.tenant.name
          )

      employmentInfo.useTransaction(trx)
      await employmentInfo.save()
    })

    return response.created({
      status: 'Created',
      message: 'Added employee successfully.',
      statusCode: 201,
    })
  }

  public async updateEmployeePersonalDetails({
    request,
    response,
    params: { userId },
  }: HttpContextContract) {
    const validatedBody = await request.validate(EmployeePersonalDetailsValidator)

    const {
      firstName,
      middleName,
      lastName,
      employeeID,
      dateOfBirth,
      nationality,
      gender,
      maritalStatus,
      logoUrl
    } = validatedBody

    await Database.transaction(async (trx) => {
      const user = await User.findByOrFail('id', userId)

      user.firstName = firstName
      user.middleName = middleName
      user.lastName = lastName
      user.gender = gender
      user.maritalStatus = maritalStatus
      user.dateOfBirth = dateOfBirth
      user.nationality = nationality
      user.logoUrl = logoUrl

      user.useTransaction(trx)
      await user.save()

      if (!request.tenant.autoGenerateEmployeeId) {
        const employmentInfo = await EmploymentInfo.findByOrFail('userId', userId)
        employmentInfo.employeeId = employeeID
        employmentInfo.useTransaction(trx)
        await employmentInfo.save()
      }
    })

    return response.ok({
      status: 'Success',
      message: 'Updated details successfully.',
      statusCode: 200,
    })
  }

  public async updateEmployeeContactDetails({
    request,
    response,
    params: { userId },
  }: HttpContextContract) {
    const validatedBody = await request.validate(EmployeeContactDetailsValidator)

    const {
      street,
      zipCode,
      lgaId,
      stateId,
      countryId,
      personalEmail,
      homePhoneNumber,
      mobilePhoneNumber,
      workPhoneNumber,
    } = validatedBody

    await Database.transaction(async (trx) => {
      const user = await User.findByOrFail('id', userId)

      user.phoneNumber = mobilePhoneNumber
      user.useTransaction(trx)
      await user.save()

      const searchPayload = { userId }
      const persistancePayload = {
        street,
        zipCode,
        lgaId,
        stateId,
        countryId,
        personalEmail,
        homePhoneNumber,
        workPhoneNumber,
      }

      await ContactDetail.updateOrCreate(searchPayload, persistancePayload, { client: trx })
    })

    return response.ok({
      status: 'Success',
      message: 'Updated details successfully.',
      statusCode: 200,
    })
  }

  public async updateEmployeeNextOfKin({
    request,
    response,
    params: { userId },
  }: HttpContextContract) {
    const validatedBody = await request.validate(EmployeeNextOfKinValidator)

    const { type, firstName, lastName, email, phoneNumber, homeAddress, relationship } =
      validatedBody

    const searchPayload = { userId }
    const persistancePayload = {
      type,
      firstName,
      lastName,
      email,
      phoneNumber,
      homeAddress,
      relationship,
    }

    await NextOfKin.updateOrCreate(searchPayload, persistancePayload)
    return response.ok({
      status: 'Success',
      message: 'Updated details successfully.',
      statusCode: 200,
    })
  }

  public async updateEmployeeEmploymentInfo({
    request,
    response,
    params: { userId },
  }: HttpContextContract) {
    const validatedBody = await request.validate(EmployeeInfoValidator)

    const { employmentTypeId, departmentId, position, workMode, resumptionDate } = validatedBody

    const searchPayload = { userId }
    const persistancePayload = {
      employmentTypeId,
      departmentId,
      position,
      workMode,
      resumptionDate,
    }

    await EmploymentInfo.updateOrCreate(searchPayload, persistancePayload)
    return response.ok({
      status: 'Success',
      message: 'Updated details successfully.',
      statusCode: 200,
    })
  }

  public async fetchAllCompanyEmployees({
    params: { companyId },
    request,
    response,
  }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    const employeeRole = await Role.findBy('name', Roles.EMPLOYEE)

    if (!employeeRole) {
      return response.badRequest({
        status: 'Bad Request',
        message: 'Error occured fetching employee.',
        statusCode: 400,
      })
    }

    const employees = await User.query()
      .where('companyId', companyId)
      .where('isDeleted', false)
      .where('roleId', employeeRole.id)
      .preload('role').preload('company').preload('employmentInfo', (builder)=> {
        builder.preload('department').preload('employmentType')
      }).preload('contactDetail')
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)

    return response.ok({
      status: 'Success',
      message: 'Fetched employees successfully.',
      statusCode: 200,
      results: employees,
    })
  }
}
