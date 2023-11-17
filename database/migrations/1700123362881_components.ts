import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Frequency from 'App/Enums/Frequency'
import ComponentTypes from 'App/Enums/ComponentTypes'

export default class extends BaseSchema {
  protected tableName = 'components'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.enum('type', [ComponentTypes.DEDUCTIONS, ComponentTypes.EARNINGS])
      table.uuid('company_id').notNullable()
      table.boolean('is_fixed').notNullable().defaultTo(false)
      table.string('rate').nullable()
      table.decimal('amount', 19, 4).nullable()
      table.enum('frequency', [Frequency.ANNUALLY, Frequency.MONTHLY, Frequency.QUARTERLY])
      table.text('comments').nullable()
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
