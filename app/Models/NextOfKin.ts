import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class NextOfKin extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public type: string

  @column()
  public userId: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column()
  public phoneNumber: string

  @column()
  public homeAddress: string

  @column()
  public relationship: string

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(nextOfKin: NextOfKin) {
    nextOfKin.id = uuid()
  }
}
