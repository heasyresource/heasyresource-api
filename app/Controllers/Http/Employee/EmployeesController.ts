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
import EmployeeEducationValidator from 'App/Validators/EmployeeEducationValidator'
import Education from 'App/Models/Education'
import WorkExperience from 'App/Models/WorkExperience'
import LicenseOrCertification from 'App/Models/LicenseOrCertification'
import EmployeeWorkExperienceValidator from 'App/Validators/EmployeeWorkExperienceValidator'
import EmployeeLicenseOrCertificationValidator from 'App/Validators/EmployeeLicenseOrCertificationValidator'
import * as fs from 'fs'
import { parseStream } from 'fast-csv'
import Application from '@ioc:Adonis/Core/Application'
import UrlValidator from 'App/Validators/UrlValidator'
import EmploymentStatuses from 'App/Enums/EmploymentStatuses'
import Salary from 'App/Models/Salary'
import EmployeeSalaryValidator from 'App/Validators/EmployeeSalaryValidator'
import EmployeeStatusValidator from 'App/Validators/EmployeeStatusValidator'
import { DateTime } from 'luxon'

export default class EmployeesController {
  public async addEmployee({ request, response }: HttpContextContract) {
    const validatedBody = await request.validate(AddEmployeeValidator)

    const {
      firstName,
      middleName,
      lastName,
      employeeID,
      position,
      departmentId,
      email,
      gender,
      logoUrl,
    } = validatedBody

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

    console.log({ generatedPassword })

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
      user.isDefaultPassword = true

      user.useTransaction(trx)
      await user.save()

      //   await new VerifyEmail(user).sendLater()

      const employmentInfo = new EmploymentInfo()
      employmentInfo.userId = user.id
      employmentInfo.position = position
      employmentInfo.departmentId = departmentId
      employmentInfo.status = EmploymentStatuses.EMPLOYED
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

  public async addBulkEmployee({ request, response }: HttpContextContract) {
    const employeesFile = request.file('employees', {
      size: '1',
      extnames: ['csv'],
    })

    const employeesFileURL = await EmployeeService.uploadFile(employeesFile)
    const employees: any = []

    if (employeesFileURL) {
      return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(Application.tmpPath() + '/' + employeesFileURL)

        parseStream(stream, { headers: true, ignoreEmpty: true, maxRows: 10, trim: true })
          .on('error', (error) => console.error(error))
          .on('data', (row) => {
            employees.push(row)
          })
          .on('end', async (rowCount: number) => {
            console.log(`Parsed ${rowCount} rows`)
            EmployeeService.bulkCreate(employees, response, request)
              .then((failedRecords) => {
                resolve({
                  status: 'Success',
                  message: `Employees uploaded ${
                    failedRecords.length > 0
                      ? `with ${failedRecords.length} errors.`
                      : 'successfully.'
                  }`,
                  statusCode: 200,
                  failedRecords,
                })
              })
              .catch((err) => {
                console.error(err.messages)
                reject(err)
              })
          })
      })
    }
  }

  public async retryAddBulkEmployee({ request, response }: HttpContextContract) {
    const { employees } = request.body()

    const failedRecords = await EmployeeService.bulkCreate(employees, response, request)

    return response.ok({
      status: 'Success',
      message: `Employees uploaded ${
        failedRecords.length > 0 ? `with ${failedRecords.length} errors` : 'successfully'
      }`,
      statusCode: 200,
      failedRecords,
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
      logoUrl,
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

    const searchPayload = { userId, type }
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
    const { search, departmentId, status, employeeId } = request.qs()

    const employeeRole = await Role.findBy('name', Roles.EMPLOYEE)

    if (!employeeRole) {
      return response.badRequest({
        status: 'Bad Request',
        message: 'Error occured fetching employee.',
        statusCode: 400,
      })
    }

    let userIds
    if (departmentId || status || employeeId) {
      const usersWithDepartmentId = await EmploymentInfo.query()
        .if(departmentId, (query) => {
          query.where('departmentId', departmentId)
        })
        .if(status, (query) => {
          query.where('status', status)
        })
        .if(employeeId, (query) => {
          query.whereILike('employeeId', `%${employeeId}%`)
        })
        .select('userId')
      userIds = usersWithDepartmentId.map((user) => user.userId)
    }

    const employees = await User.query()
      .if(search, (query) => {
        query.where((q) => {
          q.whereILike('firstName', `%${search}%`)
            .orWhereILike('lastName', `%${search}%`)
            .orWhereILike('middleName', `%${search}%`)
        })
      })
      .if(userIds, (query) => {
        query.whereIn('id', userIds)
      })
      .where('companyId', companyId)
      .where('isDeleted', false)
      .where('roleId', employeeRole.id)
      .preload('role')
      .preload('company')
      .preload('employmentInfo', (builder) => {
        builder.preload('department').preload('employmentType')
      })
      // .preload('contactDetail')
      // .preload('nextOfKin')
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)

    return response.ok({
      status: 'Success',
      message: 'Fetched employees successfully.',
      statusCode: 200,
      results: employees,
    })
  }

  public async fetchSingleCompanyEmployee({
    params: { companyId, userId },
    response,
  }: HttpContextContract) {
    const employee = await User.query()
      .where('id', userId)
      .where('companyId', companyId)
      .where('isDeleted', false)
      .preload('role')
      .preload('company')
      .preload('employmentInfo', (builder) => {
        builder.preload('department').preload('employmentType')
      })
      .preload('contactDetail', (builder) => {
        builder.preload('country').preload('state').preload('lga')
      })
      .preload('nextOfKin')
      .preload('educations')
      .preload('workExperiences', (builder) => {
        builder.preload('employmentType')
      })
      .preload('licenseOrCertifications')
      .first()

    return response.ok({
      status: 'Success',
      message: 'Fetched employee successfully.',
      statusCode: 200,
      results: employee,
    })
  }

  public async addEmployeeEducation({
    request,
    response,
    params: { userId },
  }: HttpContextContract) {
    const validatedBody = await request.validate(EmployeeEducationValidator)

    const { institution, degree, fieldOfStudy, grade, startDate, endDate, description } =
      validatedBody

    await Education.firstOrCreate(
      {
        userId,
        institution,
        degree,
        fieldOfStudy,
        grade,
        startDate,
        endDate,
      },
      {
        userId,
        institution,
        degree,
        fieldOfStudy,
        grade,
        startDate,
        endDate,
        description,
      }
    )
    return response.ok({
      status: 'Success',
      message: 'Added employee education successfully',
      statusCode: '200',
    })
  }

  public async addEmployeeWorkExperience({
    request,
    response,
    params: { userId },
  }: HttpContextContract) {
    const validatedBody = await request.validate(EmployeeWorkExperienceValidator)

    const {
      companyName,
      position,
      location,
      employmentTypeId,
      workMode,
      description,
      startDate,
      endDate,
      isPresent,
    } = validatedBody

    await WorkExperience.firstOrCreate(
      {
        userId,
        companyName,
        position,
        location,
        employmentTypeId,
        workMode,
        startDate,
        isPresent,
      },
      {
        userId,
        companyName,
        position,
        location,
        employmentTypeId,
        workMode,
        description,
        startDate,
        endDate,
        isPresent,
      }
    )

    response.ok({
      status: 'Success',
      message: 'Added employee work experience successfully',
      statusCode: '200',
    })
  }

  public async addEmployeeLicenseOrCertification({
    request,
    response,
    params: { userId },
  }: HttpContextContract) {
    const validatedBody = await request.validate(EmployeeLicenseOrCertificationValidator)

    const { name, issuingOrganization, issueDate, expirationDate, credentialId, credentialUrl } =
      validatedBody

    await LicenseOrCertification.firstOrCreate(
      {
        userId,
        name,
        issuingOrganization,
        issueDate,
      },
      {
        userId,
        name,
        issuingOrganization,
        issueDate,
        expirationDate,
        credentialId,
        credentialUrl,
      }
    )

    response.ok({
      status: 'Success',
      message: 'Added employee license successfully',
      statusCode: '200',
    })
  }

  public async addEmployeeSalary({ request, response, params: { userId } }: HttpContextContract) {
    const validatedBody = await request.validate(EmployeeSalaryValidator)

    const { grossSalary, frequency, currency } = validatedBody

    await Salary.firstOrCreate(
      {
        userId,
        grossSalary,
        frequency,
        currency,
      },
      {
        userId,
        grossSalary,
        frequency,
        currency,
      }
    )

    response.ok({
      status: 'Success',
      message: 'Added employee salary successfully',
      statusCode: '200',
    })
  }

  public async updateEmployeeEducation({
    request,
    response,
    params: { userId, educationId },
  }: HttpContextContract) {
    const validatedBody = await request.validate(EmployeeEducationValidator)

    const employeeEducation = await Education.query()
      .where('id', educationId)
      .where('userId', userId)
      .firstOrFail()

    await employeeEducation.merge(validatedBody).save()

    return response.ok({
      status: 'Success',
      message: 'Updated employee education successfully',
      statusCode: '200',
    })
  }

  public async updateEmployeeWorkExperience({
    request,
    response,
    params: { userId, workExperienceId },
  }: HttpContextContract) {
    const validatedBody = await request.validate(EmployeeWorkExperienceValidator)

    const employeeWorkExperience = await WorkExperience.query()
      .where('id', workExperienceId)
      .where('userId', userId)
      .firstOrFail()

    await employeeWorkExperience.merge(validatedBody).save()

    response.ok({
      status: 'Success',
      message: 'Updated employee work experience successfully',
      statusCode: '200',
    })
  }

  public async updateEmployeeLicenseOrCertification({
    request,
    response,
    params: { userId, licenseId },
  }: HttpContextContract) {
    const validatedBody = await request.validate(EmployeeLicenseOrCertificationValidator)

    const employeeLicense = await LicenseOrCertification.query()
      .where('id', licenseId)
      .where('userId', userId)
      .firstOrFail()

    await employeeLicense.merge(validatedBody).save()

    response.ok({
      status: 'Success',
      message: 'Updated employee license successfully',
      statusCode: '200',
    })
  }

  public async updateEmployeeSalary({
    request,
    response,
    params: { userId, salaryId },
  }: HttpContextContract) {
    const validatedBody = await request.validate(EmployeeSalaryValidator)

    const employeeSalary = await Salary.query()
      .where('id', salaryId)
      .where('userId', userId)
      .firstOrFail()

    await employeeSalary.merge(validatedBody).save()

    response.ok({
      status: 'Success',
      message: 'Updated employee salary successfully',
      statusCode: '200',
    })
  }

  public async setEmployeeProfilePicture({
    request,
    response,
    params: { userId },
  }: HttpContextContract) {
    const validatedBody = await request.validate(UrlValidator)

    const { url } = validatedBody

    const user = await User.findByOrFail('id', userId)
    user.logoUrl = url
    await user.save()

    return response.ok({
      status: 'Success',
      message: 'Uploaded profile picture successfully.',
      statusCode: 200,
    })
  }

  public async setEmployeeEmploymentStatus({ request, response, params: { userId } }: HttpContextContract) {
    const validatedBody = await request.validate(EmployeeStatusValidator)

    const { status } = validatedBody

    await Database.transaction(async (trx) => {
      const employmentInfo = await EmploymentInfo.findByOrFail('userId', userId)
      employmentInfo.status = status

      if (EmploymentStatuses.TERMINATED) {
        employmentInfo.terminationDate = DateTime.local().toFormat('yyyy-M-dd')
      }
      employmentInfo.useTransaction(trx)
      await employmentInfo.save()

      const user = await User.findByOrFail('id', userId)
      user.isActive = status === EmploymentStatuses.EMPLOYED ? true : false
      user.useTransaction(trx)
      await user.save()
    })
    return response.ok({
      status: 'Success',
      message: 'Updated employee successfully.',
      statusCode: 200,
    })
  }
}
