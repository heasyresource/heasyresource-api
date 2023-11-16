import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Frequency from 'App/Enums/Frequency'
import Types from 'App/Enums/Types'

export default class extends BaseSchema {
  protected tableName = 'components'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.enum('type', [Types.DEDUCTIONS, Types.EARNINGS])
      table.uuid('company_id').references('id').inTable('companies').onDelete('CASCADE')
      table.boolean('is_fixed').notNullable()
      table.string('rate').notNullable()
      table.decimal('amount').notNullable()
      table.enum('frequency', [Frequency.ANUALLY, Frequency.MONTHLY, Frequency.QUARTERLY])
      table.text('comments').nullable()
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
