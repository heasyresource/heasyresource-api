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

export default class PaySlip extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public payPeriodFrom: Date

  @column()
  public payPeriodTo: Date

  @column()
  public paymentDate: Date

  @column()
  public grossSalary: number

  @column()
  public netSalary: number

  @column()
  public deductionBreakdown: string

  @column()
  public earningBreakdown: string

  @column()
  public totalDeductions: number

  @column()
  public totalEarnings: number

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(paySlip: PaySlip) {
    paySlip.id = uuid()
  }

  @beforeFetch()
  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof PaySlip>) {
    query.where('isDeleted', false)
  }
}
