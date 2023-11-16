import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import WorkModes from 'App/Enums/WorkModes'

export default class extends BaseSchema {
  protected tableName = 'work_experiences'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('company_name').notNullable()
      table.string('position').notNullable()
      table.string('location').nullable()
      table.uuid('employment_type_id').nullable()
      table.enum('work_mode', [WorkModes.HYBRID, WorkModes.ONSITE, WorkModes.REMOTE])
      table.text('description').nullable()
      table.dateTime('start_date').nullable()
      table.dateTime('end_date').nullable()
      table.boolean('is_present').notNullable().defaultTo(false)
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
