import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class Industry extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column({ serializeAs: null })
  public isDeleted: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(industry: Industry) {
    industry.id = uuid()
  }
}
