import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'pay_slips'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.date('pay_period_from').notNullable()
      table.date('pay_period_to').notNullable()
      table.date('payment_date').notNullable()
      table.decimal('gross_salary', 19, 4).notNullable()
      table.decimal('net_salary', 19, 4).notNullable()
      table.string('deduction_breakdown').notNullable()
      table.string('earning_breakdown').notNullable()
      table.decimal('total_deductions', 19, 4).notNullable()
      table.decimal('total_earnings', 19, 4).notNullable()
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
