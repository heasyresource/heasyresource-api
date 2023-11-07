import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contact_details'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').notNullable()
      table.string('street').nullable()
      table.string('zip_code').nullable()
      table.uuid('lga_id').nullable()
      table.uuid('state_id').nullable()
      table.uuid('country_id').nullable()
      table.string('personal_email').nullable()
      table.string('home_phone_number').nullable()
      table.string('work_phone_number').nullable()
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
