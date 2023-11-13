import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  beforeCreate,
  beforeFetch,
  beforeFind,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class Vacany extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public title: string

  @column()
  public slug: string

  @column()
  public jobCategoryId: string

  @column()
  public employmentTypeId: string

  @column()
  public workMode: string

  @column()
  public location: string

  @column()
  public description: string

  @column()
  public hiringManager: string

  @column()
  public numberOfPosition: string

  @column()
  public companyId: string

  @column()
  public link: string

  @column()
  public isActive: boolean

  @column()
  public isPublished: boolean

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(vacancy: Vacany) {
    vacancy.id = uuid()
  }

  @beforeFetch()
  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof Vacany>) {
    query.where('isDeleted', false)
  }
}
