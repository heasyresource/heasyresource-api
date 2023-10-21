import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('website').notNullable().unique()
      table.string('phone_number').notNullable().unique()
      table.text('address').notNullable()
      table.uuid('industry_id').notNullable()
      table.boolean('is_active').notNullable().defaultTo(false)
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
