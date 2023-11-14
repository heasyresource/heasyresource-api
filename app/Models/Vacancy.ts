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
// import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import EmploymentType from './EmploymentType'
import JobCategory from './JobCategory'

export default class Vacancy extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public title: string

  @column()
  // @slugify({
  //   strategy: 'shortId',
  //   fields: ['title'],
  //   allowUpdates: true,
  // })
  public slug: string

  @column()
  public jobCategoryId: string

  @column()
  public employmentTypeId: string

  @column()
  public workMode: string

  @column()
  public location: string

  @column()
  public description: string

  @column()
  public hiringManager: string

  @column()
  public numberOfPosition: string

  @column()
  public companyId: string

  @column()
  public link: string

  @column()
  public isActive: boolean

  @column()
  public isPublished: boolean

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(vacancy: Vacancy) {
    vacancy.id = uuid()
  }

  @beforeFetch()
  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof Vacancy>) {
    query.where('isDeleted', false)
  }

  @belongsTo(() => EmploymentType, {
    onQuery: (query) => {
      query.select('name')
    },
  })
  public employmentType: BelongsTo<typeof EmploymentType>

  @belongsTo(() => JobCategory, {
    onQuery: (query) => {
      query.select('name')
    },
  })
  public jobCategory: BelongsTo<typeof JobCategory>
}
