import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Frequency from 'App/Enums/Frequency'

export default class extends BaseSchema {
  protected tableName = 'salaries'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.decimal('gross_salary').notNullable()
      table.enum('frequency', [Frequency.ANUALLY, Frequency.MONTHLY, Frequency.QUARTERLY])
      table.string('currency').notNullable()
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
