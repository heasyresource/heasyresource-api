import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from 'App/Enums/Roles'
import Role from 'App/Models/Role'

export default class extends BaseSchema {

  public async up () {
    await Role.createMany([
      {
        name: Roles.HR_ADMIN,
      },
      {
        name: Roles.COMPANY_ADMIN,
      },
      {
        name: Roles.EMPLOYEE,
      },
    ])
  }

  public async down () {
    await Role.query().delete()
  }
}
