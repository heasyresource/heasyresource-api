import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  beforeCreate,
  beforeFetch,
  beforeFind,
  ModelQueryBuilderContract,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'
import User from './User'
import LeaveType from './LeaveType'

export default class UserLeave extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public leaveTypeId: string

  @column()
  public startDate: string

  @column()
  public endDate: string

  @column()
  public comments: string

  @column()
  public status: string

  @column()
  public approvedBy: string | null

  @column()
  public reasonForRejection: string

  @column()
  public rejectedBy: string | null

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(userLeave: UserLeave) {
    userLeave.id = uuid()
  }

  @beforeFetch()
  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof UserLeave>) {
    query.where('isDeleted', false)
  }

  @belongsTo(() => User, {
    onQuery: (query) => {
      query.select('firstName', 'lastName')
    },
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => LeaveType, {
    onQuery: (query) => {
      query.select('name')
    },
  })
  public leaveType: BelongsTo<typeof LeaveType>
}
