import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Country from 'App/Models/Country'
import State from 'App/Models/State'

export default class extends BaseSchema {
  public async up() {
    const nigeriaCountry = await Country.query().where('name', 'Nigeria').first()
    const nigeriaCountryId = nigeriaCountry?.id
    await State.createMany([
      {
        name: 'Abia',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Adamawa',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Akwa Ibom',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Anambra',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Bauchi',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Bayelsa',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Benue',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Borno',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Cross River',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Delta',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Ebonyi',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Edo',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Ekiti',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Enugu',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Federal Capital Territory',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Gombe',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Imo',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Jigawa',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Kaduna',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Kano',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Katsina',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Kebbi',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Kogi',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Kwara',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Lagos',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Nasarawa',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Niger',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Ogun',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Ondo',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Osun',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Oyo',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Plateau',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Rivers',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Sokoto',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Taraba',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Yobe',
        countryId: nigeriaCountryId,
      },
      {
        name: 'Zamfara',
        countryId: nigeriaCountryId,
      },
    ])
  }

  public async down() {
    await State.query().delete()
  }
}
