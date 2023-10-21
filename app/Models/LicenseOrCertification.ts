import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class LicenseOrCertification extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public name: string

  @column()
  public issuingOrganization: string

  @column()
  public issueDate: DateTime

  @column()
  public expirationDate: DateTime

  @column()
  public credentialId: string

  @column()
  public credentialUrl: string

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(licenseOrCertification: LicenseOrCertification) {
    licenseOrCertification.id = uuid()
  }
}
