import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import MaritalStatuses from 'App/Enums/MaritalStatuses'
import Genders from 'App/Enums/Genders'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('first_name').notNullable()
      table.string('middle_name').nullable()
      table.string('last_name').notNullable()
      table.string('email').notNullable().unique()
      table.string('phone_number').nullable().unique()
      table.enum('gender', [Genders.MALE, Genders.FEMALE])
      table.text('home_address').nullable()
      table.enum('marital_status', [
        MaritalStatuses.SINGLE,
        MaritalStatuses.MARRIED,
        MaritalStatuses.DIVORCED,
        MaritalStatuses.WIDOWED,
        MaritalStatuses.SEPARATED,
      ])
      table.date('date_of_birth').nullable()
      table.string('nationality').nullable()
      table.string('password').notNullable()
      table.boolean('is_active').notNullable().defaultTo(false)
      table.boolean('is_verified').notNullable().defaultTo(false)
      table.boolean('is_default_password').notNullable().defaultTo(false)
      table.integer('verification_code').nullable()
      table.dateTime('verification_code_sent_at').nullable()
      table.uuid('company_id').notNullable()
      table.uuid('role_id').notNullable()
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
