import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  HasOne,
  ModelQueryBuilderContract,
  beforeCreate,
  beforeFetch,
  beforeFind,
  beforeSave,
  belongsTo,
  column,
  hasMany,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import { v4 as uuid } from 'uuid'
import Role from './Role'
import Company from './Company'
import EmploymentInfo from './EmploymentInfo'
import ContactDetail from './ContactDetail'
import NextOfKin from './NextOfKin'
import Education from './Education'
import WorkExperience from './WorkExperience'
import LicenseOrCertification from './LicenseOrCertification'
import Salary from './Salary'
import UserComponent from './UserComponent'

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

  @column()
  public dateOfBirth: string

  @column()
  public nationality: string

  @column()
  public logoUrl: string | undefined

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
      query.select('name', 'subdomain', 'isActive', 'logoUrl')
    },
  })
  public company: BelongsTo<typeof Company>

  @hasOne(() => EmploymentInfo)
  public employmentInfo: HasOne<typeof EmploymentInfo>

  @hasOne(() => ContactDetail)
  public contactDetail: HasOne<typeof ContactDetail>

  @hasOne(() => Salary)
  public salary: HasOne<typeof Salary>

  @hasMany(() => NextOfKin)
  public nextOfKin: HasMany<typeof NextOfKin>

  @hasMany(() => Education)
  public educations: HasMany<typeof Education>

  @hasMany(() => WorkExperience)
  public workExperiences: HasMany<typeof WorkExperience>

  @hasMany(() => LicenseOrCertification)
  public licenseOrCertifications: HasMany<typeof LicenseOrCertification>

  @hasMany(() => UserComponent)
  public components: HasMany<typeof UserComponent>

  @beforeFetch()
  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof User>) {
    query.where('isDeleted', false)
  }
}
