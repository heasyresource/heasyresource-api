import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import WorkType from 'App/Enums/WorkType'

export default class extends BaseSchema {
  protected tableName = 'employment_infos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('employee_id').notNullable().unique()
      table.uuid('user_id').notNullable()
      table.uuid('employment_type_id').notNullable()
      table.uuid('department_id').notNullable()
      table.string('position').notNullable()
      table.string('salary').notNullable()
      table.enum('work_type', [WorkType.HYBRID, WorkType.ONSITE, WorkType.REMOTE])
      table.uuid('status_id').notNullable()
      table.dateTime('resumption_date').nullable()
      table.dateTime('termination_date').nullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
