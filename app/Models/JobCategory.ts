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

export default class JobCategory extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public companyId: string

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(jobCategory: JobCategory) {
    jobCategory.id = uuid()
  }

  @beforeFetch()
  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof JobCategory>) {
    query.where('isDeleted', false)
  }
}
