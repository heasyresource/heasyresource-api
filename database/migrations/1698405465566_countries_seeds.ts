import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Country from 'App/Models/Country'

export default class extends BaseSchema {
  public async up() {
    await Country.createMany([
      {
        name: 'Nigeria',
      },
    ])
  }

  public async down() {
    await Country.query().delete()
  }
}
