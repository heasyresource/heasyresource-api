import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, ModelQueryBuilderContract, beforeFetch, beforeFind } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class Education extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public institution: string

  @column()
  public degree: string

  @column()
  public fieldOfStudy: string

  @column()
  public grade: string

  @column()
  public startDate: string

  @column()
  public endDate: string

  @column()
  public description: string | undefined

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(education: Education) {
    education.id = uuid()
  }

  @beforeFetch()
  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof Education>) {
    query.where('isDeleted', false)
  }
}
