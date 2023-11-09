import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import CompanySize from 'App/Models/CompanySize'

export default class extends BaseSchema {
  public async up() {
    await CompanySize.createMany([
      {
        size: 'Micro (1-9 employees)',
        order: 1
      },
      {
        size: 'Small (10-49 employees)',
        order: 2
      },
      {
        size: 'Medium (50-249 employees)',
        order: 3
      },
      {
        size: 'Large (250-999 employees)',
        order: 4
      },
      {
        size: 'Very Large (1000-4999 employees)',
        order: 5
      },
      {
        size: 'Huge (5000-9999 employees)',
        order: 6
      },
      {
        size: 'Giant (10,000+ employees)',
        order: 7
      },
    ])
  }

  public async down() {
    await CompanySize.query().delete()
  }
}
