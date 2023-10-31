import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'

export default class Subdomain {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const subdomain = request.header('x-subdomain-name')

    if (!subdomain) {
      return response.forbidden({
        status: 'Forbidden',
        message: 'Header is missing.',
        statusCode: 403,
      })
    }

    const subdomainExist = await Company.findBy('subdomain', subdomain)

    if (!subdomainExist) {
      return response.notFound({
        status: 'Not Found',
        message: 'Resource Not Found.',
        statusCode: 404,
      })
    }

    // TODO : Check for company that is not active

    request.tenant = subdomainExist

    await next()
  }
}
