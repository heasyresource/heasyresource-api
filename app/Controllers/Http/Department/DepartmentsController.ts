import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Department from 'App/Models/Department'
import CreateDepartmentValidator from 'App/Validators/CreateDepartmentValidator'
import CreateMultipleDepartmentValidator from 'App/Validators/CreateMultipleDepartmentValidator'

export default class DepartmentsController {
  public async fetchAllDepartment({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    const department = await Department.query()
      .where('companyId', request.tenant.id)
      .where('isDeleted', false)
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)
    return response.ok({
      status: 'Success',
      message: 'Fetched department successfully.',
      statusCode: 200,
      results: department,
    })
  }

  public async createDepartment({ request, response }: HttpContextContract) {
    const validatedBody = await request.validate(CreateDepartmentValidator)

    const { code, name } = validatedBody

    await Department.firstOrCreate({ code, name, companyId: request.tenant.id })

    return response.created({
      status: 'Created',
      message: 'Created department successfully.',
      statusCode: 201,
    })
  }

  public async createMultipleDepartment({ request, response }: HttpContextContract) {
    const validatedBody = await request.validate(CreateMultipleDepartmentValidator)

    const { departments } = validatedBody

    departments.forEach(async (department) => {
      await Department.firstOrCreate({ ...department, companyId: request.tenant.id })
    })

    return response.created({
      status: 'Created',
      message: 'Created department successfully.',
      statusCode: 201,
    })
  }

  public async updateDepartment({ params: { id }, request, response }: HttpContextContract) {
    const department = await Department.query()
      .where('id', id)
      .where('companyId', request.tenant.id)
      .firstOrFail()

    const validatedBody = await request.validate(CreateDepartmentValidator)

    await department.merge(validatedBody).save()

    return response.ok({
      status: 'Success',
      message: 'Updated department successfully.',
      statusCode: 200,
    })
  }

  public async deleteDepartment({ params: { id }, request, response }: HttpContextContract) {
    const department = await Department.query()
      .where('id', id)
      .where('companyId', request.tenant.id)
      .firstOrFail()

    await department.merge({ isDeleted: true }).save()
    return response.ok({
      status: 'Success',
      message: 'Deleted department successfully.',
      statusCode: 200,
    })
  }
}

module.exports = DepartmentsController
