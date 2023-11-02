import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, beforeFetch, beforeFind, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class Company extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public website: string

  @column()
  public phoneNumber: string

  @column()
  public subdomain: string

  @column()
  public emailDomain: string | undefined

  @column()
  public address: string

  @column()
  public logoUrl: string

  @column()
  public companySizeId: string

  @column()
  public countryId: string

  @column()
  public industryId: string

  @column()
  public autoGenerateEmployeeId: boolean

  @column()
  public employeeIdFormat: string[] | string
  
  @column()
  public isCompletedRegistration: boolean

  @column()
  public isActive: boolean

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(company: Company) {
    company.id = uuid()
  }

  @beforeFetch()
  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof Company>) {
    query.where('isDeleted', false)
  }
}
