import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class WorkExperience extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public companyName: string

  @column()
  public position: string

  @column()
  public location: string

  @column()
  public employmentTypeId: string

  @column()
  public workType: string

  @column()
  public description: string

  @column()
  public startDate: DateTime

  @column()
  public endDate: DateTime

  @column()
  public isPresent: boolean

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(workExperience: WorkExperience) {
    workExperience.id = uuid()
  }
}
