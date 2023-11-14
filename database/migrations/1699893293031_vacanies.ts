import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import WorkModes from 'App/Enums/WorkModes'

export default class extends BaseSchema {
  protected tableName = 'vacancies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('title').notNullable()
      table.string('slug').notNullable()
      table.uuid('job_category_id').notNullable()
      table.uuid('employment_type_id')
      table.enum('work_mode', [WorkModes.HYBRID, WorkModes.ONSITE, WorkModes.REMOTE])
      table.string('location').nullable()
      table.text('description').notNullable()
      table.string('hiring_manager').notNullable()
      table.string('number_of_position').notNullable()
      table.uuid('company_id').references('id').inTable('companies').onDelete('CASCADE')
      table.text('link').nullable()
      table.boolean('is_active').notNullable().defaultTo(false)
      table.boolean('is_published').notNullable().defaultTo(false)
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
