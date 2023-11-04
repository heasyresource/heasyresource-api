import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ModelQueryBuilderContract,
  beforeCreate,
  beforeFetch,
  beforeFind,
  beforeSave,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import { v4 as uuid } from 'uuid'
import Role from './Role'
import Company from './Company'

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public firstName: string

  @column()
  public middleName: string | undefined

  @column()
  public lastName: string

  @column()
  public email: string

  @column()
  public gender: string

  @column()
  public phoneNumber: string

  @column()
  public homeAddress: string

  @column()
  public maritalStatus: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public isActive: boolean

  @column()
  public isDefaultPassword: boolean

  @column()
  public isVerified: boolean

  @column({ serializeAs: null })
  public verificationCode: string | null

  @column.dateTime({ serializeAs: null })
  public verificationCodeSentAt: DateTime

  @column()
  public roleId: string

  @column()
  public companyId: string

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(user: User) {
    user.id = uuid()
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @belongsTo(() => Company, {
    onQuery: (query) => {
      query.select('name', 'subdomain')
    },
  })
  public company: BelongsTo<typeof Company>

  @beforeFetch()
  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof User>) {
    query.where('isDeleted', false)
  }
}
