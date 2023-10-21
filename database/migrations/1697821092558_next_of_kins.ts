import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import NextOfKInRelationships from 'App/Enums/NextOfKInRelationships'

export default class extends BaseSchema {
  protected tableName = 'next_of_kins'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').notNullable().unique()
      table.string('phone_number').notNullable().unique()
      table.text('home_address').notNullable()
      table.enum('relationship', [NextOfKInRelationships.CHILD, NextOfKInRelationships.EXTENDED_FAMILY, NextOfKInRelationships.FRIEND, NextOfKInRelationships.PARENT, NextOfKInRelationships.SIBLING, NextOfKInRelationships.SPOUSE])
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
