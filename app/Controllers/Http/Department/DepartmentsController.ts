import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Department from 'App/Models/Department'

export default class DepartmentsController {
  public async index({ response }: HttpContextContract) {
    const departments = await Department.all()
    return response.json(departments)
  }

  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['name'])
    const department = await Department.create(data)
    return response.json(department)
  }

  public async show({ params, response }: HttpContextContract) {
    const department = await Department.find(params.id)
    return response.json(department)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const department = await Department.find(params.id)
    const data = request.only(['name'])
    department.merge(data)
    await department.save()
    return response.json(department)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const department = await Department.find(params.id)
    await department.delete()
    return response.json({ message: 'Department deleted' })
  }
}

module.exports = DepartmentsController
