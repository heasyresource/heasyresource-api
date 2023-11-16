import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UrlValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    url: schema.string([rules.url()]),
  })

  public messages: CustomMessages = {
    'url.required': 'Url is required.',
    'url.url': 'Url must be a valid url',
  }
}
