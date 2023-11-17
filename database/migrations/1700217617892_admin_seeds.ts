import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from 'App/Enums/Roles'
import Statuses from 'App/Enums/Statuses'
import Company from 'App/Models/Company'
import Industry from 'App/Models/Industry'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'

export default class extends BaseSchema {
  protected tableName = 'admin_seeds'

  public async up() {
    const HRAdminEmail = Env.get('HEASYRESOURCE_ADMIN_EMAIL')
    const HRAdminPassword = Env.get('HEASYRESOURCE_ADMIN_PASSWORD')

    const hrAdminRole = await Role.findByOrFail('name', Roles.HR_ADMIN)

    const industry = await Industry.findByOrFail('name', 'Information Technology (IT) and Software')

    const company = await Company.create({
      name: 'Heasy Resource',
      email: 'info@heasyresource.com',
      website: 'www.heasyresource.com',
      phoneNumber: '+2347087129777',
      status: Statuses.APPROVED,
      autoGenerateEmployeeId: false,
      isCompletedRegistration: true,
      isActive: true,
      industryId: industry.id,
    })
    await User.create({
      firstName: 'HeasyResource',
      lastName: 'Admin',
      email: HRAdminEmail,
      password: HRAdminPassword,
      isActive: true,
      isVerified: true,
      roleId: hrAdminRole.id,
      companyId: company.id,
    })
  }

  public async down() {}
}
