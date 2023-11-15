import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class JobCategoryValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
		id: this.ctx.params.jobCategoryId || null
	})

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.unique({
        table: 'job_categories',
        column: 'name',
        where: {
          company_id: this.ctx.request.tenant.id,
          is_deleted: false,
        },
        whereNot: { id: this.refs.id },
      }),
    ]),
  })

  public messages: CustomMessages = {
    'name.required': 'Job category name is required',
    'name.unique': 'Job category name already exist.',
  }
}
