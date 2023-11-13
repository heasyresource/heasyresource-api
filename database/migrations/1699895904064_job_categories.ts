import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'job_categories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.uuid('company_id').references('id').inTable('companies').onDelete('CASCADE')
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
