import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'
import Department from './Department'
import EmploymentType from './EmploymentType'

export default class EmploymentInfo extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public employeeId: string | undefined

  @column()
  public userId: string

  @column()
  public employmentTypeId: string

  @column()
  public departmentId: string

  @column()
  public position: string

  @column()
  public salary: string

  @column()
  public workMode: string

  @column()
  public resumptionDate: string

  @column()
  public terminationDate: Date

  @column()
  public status: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(employmentInfo: EmploymentInfo) {
    employmentInfo.id = uuid()
  }

  @belongsTo(() => Department,{
    onQuery: (query) => {
      query.select('id', 'name', 'code')
    },
  })
  public department: BelongsTo<typeof Department>

  @belongsTo(() => EmploymentType,{
    onQuery: (query) => {
      query.select('id', 'name')
    },
  })
  public employmentType: BelongsTo<typeof EmploymentType>
}
