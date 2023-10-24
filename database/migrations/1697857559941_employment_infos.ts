import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import WorkModes from 'App/Enums/WorkModes'

export default class extends BaseSchema {
  protected tableName = 'employment_infos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('employee_id').notNullable().unique()
      table.uuid('user_id').notNullable()
      table.uuid('employment_type_id').nullable()
      table.uuid('department_id').nullable()
      table.string('position').nullable()
      table.string('salary').nullable()
      table.enum('work_type', [WorkModes.HYBRID, WorkModes.ONSITE, WorkModes.REMOTE])
      table.dateTime('resumption_date').nullable()
      table.dateTime('termination_date').nullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
