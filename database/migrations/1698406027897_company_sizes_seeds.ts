import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import CompanySize from 'App/Models/CompanySize'

export default class extends BaseSchema {
  public async up() {
    await CompanySize.createMany([
      {
        size: 'Micro (1-9 employees)',
      },
      {
        size: 'Small (10-49 employees)',
      },
      {
        size: 'Medium (50-249 employees)',
      },
      {
        size: 'Large (250-999 employees)',
      },
      {
        size: 'Very Large (1000-4999 employees)',
      },
      {
        size: 'Huge (5000-9999 employees)',
      },
      {
        size: 'Giant (10,000+ employees)',
      },
    ])
  }

  public async down() {
    await CompanySize.query().delete()
  }
}
