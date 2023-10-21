import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'educations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').notNullable()
      table.string('institution').notNullable()
      table.string('degree').notNullable()
      table.string('field_of_study').notNullable()
      table.string('grade').notNullable()
      table.dateTime('start_date').notNullable()
      table.dateTime('end_date').notNullable()
      table.text('description').notNullable()
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
