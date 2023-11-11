import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, beforeFetch, beforeFind, ModelQueryBuilderContract, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'
import EmploymentType from './EmploymentType'

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
  public workMode: string

  @column()
  public description: string

  @column()
  public startDate: string

  @column()
  public endDate: string

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

  @beforeFetch()
  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof WorkExperience>) {
    query.where('isDeleted', false)
  }

  @belongsTo(() => EmploymentType,{
    onQuery: (query) => {
      query.select('id', 'name')
    },
  })
  public employmentType: BelongsTo<typeof EmploymentType>
}
