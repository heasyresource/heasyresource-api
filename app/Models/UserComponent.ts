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
import Component from './Component'

export default class UserComponent extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public componentId: string

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(userComponent: UserComponent) {
    userComponent.id = uuid()
  }

  @beforeFetch()
  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof UserComponent>) {
    query.where('isDeleted', false)
  }

  @belongsTo(() => Component, {
    onQuery: (query) => {
      query.select('name')
    },
  })
  public component: BelongsTo<typeof Component>
}
