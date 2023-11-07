import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import WorkModes from 'App/Enums/WorkModes'

export default class extends BaseSchema {
  protected tableName = 'employment_infos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('employee_id').nullable().unique()
      table.uuid('user_id').notNullable()
      table.uuid('employment_type_id').nullable()
      table.uuid('department_id').nullable()
      table.string('position').nullable()
      table.string('salary').nullable()
      table.enum('work_mode', [WorkModes.HYBRID, WorkModes.ONSITE, WorkModes.REMOTE])
      table.date('resumption_date').nullable()
      table.date('termination_date').nullable()
      table.string('status').nullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
