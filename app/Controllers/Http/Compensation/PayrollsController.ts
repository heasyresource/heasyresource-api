import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class PayrollsController {
  public async runPayroll({ response, request }: HttpContextContract) {
    console.log(request.tenant.id);
    
    const users = await User.query()
      .where('companyId', request.tenant.id)
      .where('isActive', true)
      .preload('salary')
      .preload('components', (builder) => {
        builder.preload('component')
      })

    // const components = await UserComponent.query().where('userId', userId).preload('component')
      const userWithComponents = users.filter((user) => user.components.length && user.salary !== null)


    return response.ok({
      status: 'Success',
      message: 'Fetched all components successfully',
      statusCode: 200,
      results: userWithComponents,
    })
  }
}
