import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').notNullable().unique()
      table.string('phone_number').nullable().unique()
      table.string('password').notNullable()
      table.boolean('is_active').notNullable().defaultTo(false)
      table.boolean('is_verified').notNullable().defaultTo(false)
      table.integer('verification_code').nullable()
      table.dateTime('verification_code_sent_at').nullable()
      table.uuid('role_id').notNullable()
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
