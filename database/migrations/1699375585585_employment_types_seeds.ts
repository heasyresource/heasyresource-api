import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import EmploymentType from 'App/Models/EmploymentType'

export default class extends BaseSchema {
  public async up() {
    await EmploymentType.createMany([
      {
        name: 'Full-time',
      },
      {
        name: 'Part-time',
      },
      {
        name: 'Freelance',
      },
      {
        name: 'Contract',
      },
      {
        name: 'Internship',
      },
      {
        name: 'Temporary',
      },
    ])
  }

  public async down() {
    await EmploymentType.query().delete()
  }
}
