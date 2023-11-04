import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AddEmployeeValidator from 'App/Validators/AddEmployeeValidator'
import Roles from 'App/Enums/Roles'
import Role from 'App/Models/Role'
import randomstring from 'randomstring'
import User from 'App/Models/User'
import EmploymentInfo from 'App/Models/EmploymentInfo'
import Database from '@ioc:Adonis/Lucid/Database'
import EmployeeService from 'App/Services/EmployeeService'

export default class EmployeesController {
  public async addEmployee({ request, response }: HttpContextContract) {
    const validatedBody = await request.validate(AddEmployeeValidator)

    const { firstName, middleName, lastName, employeeID, position, departmentId, email, gender } =
      validatedBody

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

    console.log({generatedPassword});
    
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
}
