import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Statuses from 'App/Enums/Statuses'

export default class extends BaseSchema {
  protected tableName = 'applicants'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').notNullable()
      table.string('phone_number').notNullable()
      table.string('address').notNullable()
      table.string('city').notNullable()
      table.uuid('state_id').references('id').inTable('states').onDelete('CASCADE')
      table.uuid('country_id').references('id').inTable('countries').onDelete('CASCADE')
      table.uuid('vacancy_id').references('id').inTable('vacancies').onDelete('CASCADE')
      table.text('resume_url').notNullable()
      table.enum('status', [
        Statuses.APPROVED,
        Statuses.PENDING,
        Statuses.REJECTED,
        Statuses.SUSPENDED,
      ])
      table.text('reason').notNullable()
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
