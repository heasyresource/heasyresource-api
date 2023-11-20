import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Roles from 'App/Enums/Roles'
import Statuses from 'App/Enums/Statuses'
import Company from 'App/Models/Company'
import EmploymentType from 'App/Models/EmploymentType'
import Role from 'App/Models/Role'
import { DateTime } from 'luxon'

export default class AnalyticsController {
  public async getCompanyAnalytics({ params: { companyId }, response }: HttpContextContract) {
    const company = await Company.query().where('id', companyId).firstOrFail()
    const companyAdminRole = await Role.findByOrFail('name', Roles.COMPANY_ADMIN)

    const users = await Database.from('users')
      .where('company_id', company.id)
      .where('is_deleted', false)
      .whereNot('role_id', companyAdminRole.id)
      .count('*', 'total')

    const today = DateTime.now()

    const startOfPastWeek = today.minus({ days: 7 })

    const newUsers = await Database.from('users')
      .where('company_id', company.id)
      .where('is_deleted', false)
      .whereNot('role_id', companyAdminRole.id)
      .where('created_at', '>=', startOfPastWeek.toJSDate())
      .count('*', 'total')

    const vacancies = await Database.from('vacancies')
      .where('company_id', company.id)
      .where('is_deleted', false)
      .count('*', 'total')

    let userIds = await Database.from('users').where('company_id', company.id).select('id')
    userIds = userIds.map((user) => user.id)

    const leaveRequests = await Database.from('user_leaves')
      .whereIn('user_id', userIds)
      .where('is_deleted', false)
      .count('*', 'total')

    const fullTimeEmployment = await EmploymentType.query().where('name', 'Full-time').first()
    const partTimeEmployment = await EmploymentType.query().where('name', 'Part-time').first()
    const contractEmployment = await EmploymentType.query().where('name', 'Contract').first()
    const freelanceEmployment = await EmploymentType.query().where('name', 'Freelance').first()
    const intershipEmployment = await EmploymentType.query().where('name', 'Internship').first()
    const temporaryEmployment = await EmploymentType.query().where('name', 'Temporary').first()

    let fullTimeEmployeeCount = 0
    if (fullTimeEmployment) {
      const employmentTypes = await Database.from('employment_infos')
        .whereIn('user_id', userIds)
        .where('employment_type_id', fullTimeEmployment.id)
        .count('*', 'total')

      fullTimeEmployeeCount = employmentTypes[0].total
    }

    let partTimeEmployeeCount = 0
    if (partTimeEmployment) {
      const employmentTypes = await Database.from('employment_infos')
        .whereIn('user_id', userIds)
        .where('employment_type_id', partTimeEmployment.id)
        .count('*', 'total')

      partTimeEmployeeCount = employmentTypes[0].total
    }

    let contractEmployeeCount = 0
    if (contractEmployment) {
      const employmentTypes = await Database.from('employment_infos')
        .whereIn('user_id', userIds)
        .where('employment_type_id', contractEmployment.id)
        .count('*', 'total')

      contractEmployeeCount = employmentTypes[0].total
    }

    let freelanceEmployeeCount = 0
    if (freelanceEmployment) {
      const employmentTypes = await Database.from('employment_infos')
        .whereIn('user_id', userIds)
        .where('employment_type_id', freelanceEmployment.id)
        .count('*', 'total')

      freelanceEmployeeCount = employmentTypes[0].total
    }

    let intershipEmployeeCount = 0
    if (intershipEmployment) {
      const employmentTypes = await Database.from('employment_infos')
        .whereIn('user_id', userIds)
        .where('employment_type_id', intershipEmployment.id)
        .count('*', 'total')

      intershipEmployeeCount = employmentTypes[0].total
    }

    let temporaryEmploymentCount = 0
    if (temporaryEmployment) {
      const employmentTypes = await Database.from('employment_infos')
        .whereIn('user_id', userIds)
        .where('employment_type_id', temporaryEmployment.id)
        .count('*', 'total')

      temporaryEmploymentCount = employmentTypes[0].total
    }

    const results = {
      employeeCount: users[0].total,
      newEmployeeCount: newUsers[0].total,
      vacancyCount: vacancies[0].total,
      leaveRequestCount: leaveRequests[0].total,
      fullTimeEmployeeCount,
      partTimeEmployeeCount,
      contractEmployeeCount,
      freelanceEmployeeCount,
      intershipEmployeeCount,
      temporaryEmploymentCount,
    }

    return response.ok({
      status: 'Success',
      message: 'Fetched company analytics successfully.',
      statusCode: 200,
      results,
    })
  }

  public async getAdminAnalytics({ response }: HttpContextContract) {
    const defaultCompany = 'Heasy Resource'

    const allCompanies = await Database.from('companies')
      .whereNot('name', defaultCompany)
      .where('is_deleted', false)
      .count('*', 'total')

    const activeCompanies = await Database.from('companies')
      .whereNot('name', defaultCompany)
      .where('is_deleted', false)
      .where('is_active', true)
      .count('*', 'total')

    const inActiveCompanies = await Database.from('companies')
      .whereNot('name', defaultCompany)
      .where('is_deleted', false)
      .where('is_active', false)
      .count('*', 'total')

    const rejectedCompanies = await Database.from('companies')
      .whereNot('name', defaultCompany)
      .where('is_deleted', false)
      .where('status', Statuses.REJECTED)
      .count('*', 'total')

    const suspendedCompanies = await Database.from('companies')
      .whereNot('name', defaultCompany)
      .where('is_deleted', false)
      .where('status', Statuses.SUSPENDED)
      .count('*', 'total')

    const results = {
      allCompanyCount: allCompanies[0].total,
      activeCompanyCount: activeCompanies[0].total,
      inActiveCompanyCount: inActiveCompanies[0].total,
      rejectedCompanyCount: rejectedCompanies[0].total,
      suspendedCompanyCount: suspendedCompanies[0].total,
    }

    return response.ok({
      status: 'Success',
      message: 'Fetched admin analytics successfully.',
      statusCode: 200,
      results,
    })
  }
}
