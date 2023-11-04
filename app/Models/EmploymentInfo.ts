import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

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
  public workType: string

  @column()
  public resumptionDate: Date

  @column()
  public terminationDate: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(employmentInfo: EmploymentInfo) {
    employmentInfo.id = uuid()
  }
}
