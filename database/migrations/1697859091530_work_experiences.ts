import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import WorkModes from 'App/Enums/WorkModes'

export default class extends BaseSchema {
  protected tableName = 'work_experiences'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').notNullable()
      table.string('company_name').notNullable()
      table.string('position').notNullable()
      table.string('location').nullable()
      table.uuid('employment_type_id').nullable()
      table.enum('work_type', [WorkModes.HYBRID, WorkModes.ONSITE, WorkModes.REMOTE])
      table.text('description').nullable()
      table.dateTime('start_date').nullable()
      table.dateTime('end_date').nullable()
      table.boolean('is_present').nullable()
      table.boolean('is_deleted').nullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
