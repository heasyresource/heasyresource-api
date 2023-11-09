import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, beforeCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'
import Country from './Country'
import Lga from './Lga'
import State from './State'

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

  @belongsTo(() => Country)
  public country: BelongsTo<typeof Country>

  @belongsTo(() => Lga)
  public lga: BelongsTo<typeof Lga>

  @belongsTo(() => State)
  public state: BelongsTo<typeof State>
}
