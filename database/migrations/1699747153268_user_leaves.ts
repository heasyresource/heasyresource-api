import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_leaves'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('leave_type_id').notNullable()
      table.dateTime('start_date').notNullable()
      table.dateTime('end_date').notNullable()
      table.text('comments').nullable()
      table.string('status').nullable()
      table.uuid('approved_by').nullable()
      table.text('reason_for_rejection').nullable()
      table.uuid('rejected_by').nullable()
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
