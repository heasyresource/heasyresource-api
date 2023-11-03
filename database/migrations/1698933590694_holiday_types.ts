import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'holiday_types'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.date('date').nullable()
      table.uuid('company_id').notNullable()
      table.string('availability').notNullable()
      table.boolean('is_paid').notNullable().defaultTo(false)
      table.text('comments').notNullable()
      table.boolean('is_full_day').notNullable().defaultTo(false)
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
