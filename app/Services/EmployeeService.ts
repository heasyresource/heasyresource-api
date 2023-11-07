import EmployeeIDFormats from 'App/Enums/EmployeeIDFormats'
import Department from 'App/Models/Department'
import randomstring from 'randomstring'

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
    const department = await Department.query().where('id', departmentId).firstOrFail()

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

    return !splittedEmailDomains.find((emailDomain) => emailDomain === employeeEmailDomain) ? false : true
  }
}
