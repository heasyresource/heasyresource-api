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
import Country from './Country'
import State from './State'
import Vacancy from './Vacancy'

export default class Applicant extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column()
  public phoneNumber: string

  @column()
  public address: string

  @column()
  public city: string

  @column()
  public stateId: string

  @column()
  public countryId: string

  @column()
  public vacancyId: string

  @column()
  public resumeUrl: string

  @column()
  public status: string

  @column()
  public reason: string | undefined

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(applicant: Applicant) {
    applicant.id = uuid()
  }

  @beforeFetch()
  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof Applicant>) {
    query.where('is_deleted', false)
  }

  @belongsTo(() => Country)
  public country: BelongsTo<typeof Country>

  @belongsTo(() => State)
  public state: BelongsTo<typeof State>

  @belongsTo(() => Vacancy, {
    onQuery: (query) => {
      query.select('title')
    },
  })
  public vacancy: BelongsTo<typeof Vacancy>
}
