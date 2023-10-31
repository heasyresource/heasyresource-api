import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, ModelQueryBuilderContract, beforeFetch, beforeFind } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class CompanySize extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public size: string

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true, serializeAs: null  })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null  })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(companySize: CompanySize) {
    companySize.id = uuid()
  }

  @beforeFetch()
  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof CompanySize>) {
    query.where('isDeleted', false)
  }
}
