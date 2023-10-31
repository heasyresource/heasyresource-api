import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CompanySize from 'App/Models/CompanySize'
import Country from 'App/Models/Country'
import Industry from 'App/Models/Industry'
import Lgas from 'App/Models/Lgas'
import State from 'App/Models/State'

export default class MetaDataController {
  public async metadata({ response }: HttpContextContract) {
    const countries = await Country.all()
    const states = await State.all()
    const lgas = await Lgas.all()
    const companySizes = await CompanySize.all()
    const industries = await Industry.all()

    return response.ok({
      status: 'success',
      message: 'Fetched MetaData successfully',
      statusCode: 200,
      results: {
        countries,
        states,
        lgas,
        companySizes,
        industries,
      },
    })
  }
}

module.exports = MetaDataController
