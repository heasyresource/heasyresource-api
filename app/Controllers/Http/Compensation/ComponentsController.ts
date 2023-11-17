import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Component from 'App/Models/Component'
// import UserComponent from 'App/Models/UserComponent'
// import AddUserToComponentValidator from 'App/Validators/AddUserToComponentValidator'
import ComponentValidator from 'App/Validators/ComponentValidator'

export default class ComponentsController {
  public async fetchAllComponents({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const companyId = request.input('companyId', request.tenant.id)
    const paginate = request.input('paginate', true)

    let components
    if (paginate === 'false' || paginate === false) {
      components = await Component.query()
        .where('companyId', companyId)
        .where('isDeleted', false)
        .orderBy('createdAt', 'desc')
    } else {
      components = await Component.query()
        .where('companyId', companyId)
        .where('isDeleted', false)
        .orderBy('createdAt', 'desc')
        .paginate(page, perPage)
    }

    return response.ok({
      status: 'Success',
      message: 'Fetched all components successfully',
      statusCode: 200,
      results: components,
    })
  }

  public async getComponentById({
    request,
    response,
    params: { componentId },
  }: HttpContextContract) {
    const companyId = request.input('companyId', request.tenant.id)

    const component = await Component.query()
      .where('id', componentId)
      .where('companyId', companyId)
      .firstOrFail()

    return response.ok({
      status: 'Success',
      message: 'Fetched Component successfully',
      statusCode: 200,
      result: component,
    })
  }

  public async createComponent({ request, response }: HttpContextContract) {
    const validatedBody = await request.validate(ComponentValidator)

    const { name, type, isFixed, rate, amount, frequency, comments } = validatedBody

    await Component.create({
      companyId: request.tenant.id,
      name,
      type,
      isFixed,
      rate,
      amount,
      frequency,
      comments,
    })

    return response.created({
      status: 'Success',
      message: 'Created Component successfully',
      statusCode: 201,
    })
  }

  public async updateComponent({
    request,
    response,
    params: { componentId },
  }: HttpContextContract) {
    const component = await Component.query()
      .where('id', componentId)
      .where('companyId', request.tenant.id)
      .firstOrFail()

    const validatedBody = await request.validate(ComponentValidator)

    await component.merge(validatedBody).save()

    return response.ok({
      status: 'Success',
      message: 'Updated Component successfully',
      statusCode: 200,
    })
  }

  public async deleteComponent({
    request,
    response,
    params: { componentId },
  }: HttpContextContract) {
    const component = await Component.query()
      .where('id', componentId)
      .where('companyId', request.tenant.id)
      .firstOrFail()

    await component.merge({ isDeleted: true }).save()

    return response.ok({
      status: 'Success',
      message: 'Deleted Component successfully',
      statusCode: 200,
    })
  }

//   public async addComponentsToUser({
//     request,
//     response,
//     params: { userId },
//   }: HttpContextContract) {
//     // const validatedBody = await request.validate(AddUserToComponentValidator)

//   //  const payload = componentsId.map(id) => {

//   //   })

//   //   await UserComponent.createMany({
//   //     userId,
//   //     id,
//   //   })

//     return response.created({
//       status: 'Created',
//       message: 'Created User component successfully',
//       statusCode: 201,
//     })
//   }
}
