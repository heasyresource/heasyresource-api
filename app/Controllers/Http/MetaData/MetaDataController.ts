import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CompanySize from 'App/Models/CompanySize'
import Country from 'App/Models/Country'
import EmploymentType from 'App/Models/EmploymentType'
import Industry from 'App/Models/Industry'
import Lga from 'App/Models/Lga'
import State from 'App/Models/State'

export default class MetaDataController {
  public async metadata({ response }: HttpContextContract) {
    const countries = await Country.all()
    const states = await State.all()
    const lgas = await Lga.all()
    const companySizes = await CompanySize.query().orderBy('order', 'asc')
    const industries = await Industry.all()
    const employmentType = await EmploymentType.all()

    return response.ok({
      status: 'Success',
      message: 'Fetched MetaData successfully',
      statusCode: 200,
      results: {
        countries,
        states,
        lgas,
        companySizes,
        industries,
        employmentType
      },
    })
  }
}

module.exports = MetaDataController
