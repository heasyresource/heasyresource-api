import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class ContactDetail extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public street: string

  @column()
  public zipCode: string
  
  @column()
  public lgaId: string

  @column()
  public stateId: string

  @column()
  public countryId: string

  @column()
  public personalEmail: string | undefined

  @column()
  public homePhoneNumber: string | undefined

  @column()
  public workPhoneNumber: string | undefined

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(contactDetail: ContactDetail) {
    contactDetail.id = uuid()
  }
}
