import Application from '@ioc:Adonis/Core/Application'
import EmployeeIDFormats from 'App/Enums/EmployeeIDFormats'
import Department from 'App/Models/Department'
import randomstring from 'randomstring'
import { validator, schema, rules } from '@ioc:Adonis/Core/Validator'
import Genders from 'App/Enums/Genders'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import Roles from 'App/Enums/Roles'
import EmploymentInfo from 'App/Models/EmploymentInfo'
import { Queue } from '@ioc:Rlanz/Queue';

export default class EmployeeService {
  private static getCompanyInitials(companyName) {
    const words = companyName.split(' ')
    const initials = words.map((word) => word.charAt(0).toUpperCase()).join('')
    return initials
  }
  public static async generateEmployeeId(
    format: string[] | string,
    departmentId: string,
    companyName: string
  ) {
    const department = await Department.query().select('code').where('id', departmentId).firstOrFail()

    const employeeId: any = []
    for (const item of format) {
      if (item === EmployeeIDFormats.COMPANY_INITIALS) {
        const initials = this.getCompanyInitials(companyName)
        employeeId.push(initials)
      }
      if (item === EmployeeIDFormats.DEPARTMENT_CODE) {
        employeeId.push(department.code)
      }
      if (item === EmployeeIDFormats.RANDOM_NUMBERS) {
        const numbers = randomstring.generate({
          length: 6,
          charset: 'numeric',
        })
        employeeId.push(numbers)
      }
    }

    return employeeId.join('')
  }

  public static checkValidEmailDomain(emailDomains, email) {
    if (!emailDomains) return true

    const splittedEmailDomains = emailDomains.split(',')
    const splittedEmail = email.split('@')
    const employeeEmailDomain = '@' + splittedEmail[1]

    return !!splittedEmailDomains.find((emailDomain) => emailDomain === employeeEmailDomain)
  }

  public static async uploadFile(file) {
    try {
      const timestamp = new Date().valueOf()
      if (file) {
        const fileName = `${timestamp}_${file.clientName}`
        await file.move(Application.tmpPath('uploads'), {
          name: fileName,
          overwrite: true,
        })

        const finalUrl = 'uploads/' + fileName

        return finalUrl
      }
    } catch (error) {
      console.error('Upload File Error>>', error.message)
      throw new Error(error)
    }
  }

  public static async bulkCreate(employees, response, request) {
    const failedRecords: any = []
    for (const employee of employees) {
      let validatedBody
      try {
        validatedBody = await validator.validate({
          schema: schema.create({
            firstName: schema.string({ trim: true }, [
              rules.alpha({
                allow: ['space', 'dash'],
              }),
            ]),
            middleName: schema.string.optional({ trim: true }, [
              rules.alpha({
                allow: ['space', 'dash'],
              }),
            ]),
            lastName: schema.string({ trim: true }, [
              rules.alpha({
                allow: ['space', 'dash'],
              }),
            ]),
            gender: schema.enum(Object.values(Genders)),
            workEmail: schema.string({ trim: true }, [
              rules.email(),
              rules.normalizeEmail({
                allLowercase: true,
                gmailRemoveDots: true,
                gmailRemoveSubaddress: true,
              }),
              rules.unique({ table: 'users', column: 'email' }),
            ]),
            phoneNumber: schema.string([
              rules.mobile({
                strict: false,
                locale: ['en-NG'],
              }),
              rules.unique({ table: 'users', column: 'phone_number' }),
            ]),
            position: schema.string({ trim: true }),
            departmentName: schema.string({ trim: true }, [
              rules.exists({
                table: 'departments',
                column: 'name',
                where: {
                  is_deleted: false,
                },
              }),
            ]),
            employeeID: schema.string.optional({ trim: true }),
            dateOfBirth: schema.date({
              format: 'yyyy-MM-dd',
            }),
          }),
          messages: {
            'firstName.required': 'First name is required.',
            'firstName.alpha': 'First name should only contain alphabets.',
            'middleName.required': 'Middle name is required.',
            'middleName.alpha': 'Middle name should only contain alphabets.',
            'lastName.required': 'Last name is required.',
            'lastName.alpha': 'Last name should only contain alphabets.',
            'gender.required': 'Gender is required.',
            'gender.enum': 'Please select a correct gender.',
            'workEmail.required': 'Email address is required.',
            'workEmail.email': 'Email address must be a valid email address.',
            'workEmail.unique': 'This email address already exist.',
            'phoneNumber.required': 'Phone number is required.',
            'phoneNumber.unique': 'This phone number already exist.',
            'phoneNumber.mobile': 'Phone number must be a valid phone number.',
            'position.required': 'Position is required.',
            'departmentName.required': 'Please select a valid department.',
            'departmentName.exists': 'Please select a valid department.',
            'dateOfBirth.required': 'Date of birth is required',
            'dateOfBirth.date': 'Date of birth should be in this format yyyy-MM-dd',
            'dateOfBirth.date.format': 'Date of birth should be in this format yyyy-MM-dd',
          },
          reporter: validator.reporters.api,
          data: employee,
        })
      } catch (error) {
        failedRecords.push({ employee, validation: error.messages })
      }

      if (validatedBody) {
        const {
          firstName,
          middleName,
          lastName,
          employeeID,
          position,
          departmentName,
          workEmail,
          gender,
        } = validatedBody

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

        const department = await Department.query()
          .where('name', departmentName)
          .where('companyId', request.tenant.id)
          .firstOrFail()

        const payload = {
          firstName,
          middleName,
          lastName,
          employeeID,
          position,
          workEmail,
          gender,
          generatedPassword,
          roleId: employeeRole.id,
          companyId: request.tenant.id,
          autoGenerateEmployeeId: request.tenant.autoGenerateEmployeeId,
          department,
          employeeIdFormat: request.tenant.employeeIdFormat,
          companyName: request.tenant.name,
        }
        Queue.dispatch('App/Jobs/AddEmployee', payload);
      }
    }
    return failedRecords
  }

  public static async saveEmployee(payload) {
    const {
      firstName,
      middleName,
      lastName,
      employeeID,
      position,
      workEmail,
      gender,
      generatedPassword,
      roleId,
      companyId,
      autoGenerateEmployeeId,
      department,
      employeeIdFormat,
      companyName,
    } = payload

    await Database.transaction(async (trx) => {
      const user = new User()
      user.firstName = firstName
      user.middleName = middleName
      user.lastName = lastName
      user.email = workEmail
      user.gender = gender
      user.password = generatedPassword
      user.isActive = true
      user.isVerified = true
      user.roleId = roleId
      user.companyId = companyId
      user.isDefaultPassword = true

      user.useTransaction(trx)
      await user.save()

      //   await new VerifyEmail(user).sendLater()

      const employmentInfo = new EmploymentInfo()
      employmentInfo.userId = user.id
      employmentInfo.position = position
      employmentInfo.departmentId = department.id
      employmentInfo.employeeId = !autoGenerateEmployeeId
        ? employeeID
        : await EmployeeService.generateEmployeeId(employeeIdFormat, department.id, companyName)

      employmentInfo.useTransaction(trx)
      await employmentInfo.save()

    })

    console.log('Saved ===>', workEmail);
    
  }
}
