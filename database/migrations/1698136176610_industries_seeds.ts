import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Industry from 'App/Models/Industry'

export default class extends BaseSchema {
  public async up() {
    await Industry.createMany([
      {
        name: 'Agriculture and Farming',
      },
      {
        name: 'Automotive',
      },
      {
        name: 'Banking and Financial Services',
      },
      {
        name: 'Biotechnology',
      },
      {
        name: 'Chemicals',
      },
      {
        name: 'Construction',
      },
      {
        name: 'Consumer Goods',
      },
      {
        name: 'Education',
      },
      {
        name: 'Energy and Utilities',
      },
      {
        name: 'Entertainment and Media',
      },
      {
        name: 'Food and Beverage',
      },
      {
        name: 'Government and Public Sector',
      },
      {
        name: 'Healthcare and Pharmaceuticals',
      },
      {
        name: 'Hospitality and Tourism',
      },
      {
        name: 'Information Technology (IT) and Software',
      },
      {
        name: 'Insurance',
      },
      {
        name: 'Manufacturing',
      },
      {
        name: 'Nonprofit and Social Services',
      },
      {
        name: 'Real Estate',
      },
      {
        name: 'Retail',
      },
      {
        name: 'Telecommunications',
      },
      {
        name: 'Transportation and Logistics',
      },
      {
        name: 'Travel and Leisure',
      },
      {
        name: 'E-commerce',
      },
      {
        name: 'Environmental Services',
      },
      {
        name: 'Legal Services',
      },
      {
        name: 'Management Consulting',
      },
      {
        name: 'Market Research',
      },
      {
        name: 'Mining and Metals',
      },
      {
        name: 'Professional Services',
      },
      {
        name: 'Renewable Energy',
      },
      {
        name: 'Security and Investigations',
      },
      {
        name: 'Sports',
      },
      {
        name: 'Waste Management',
      },
      {
        name: 'Architecture and Planning',
      },
      {
        name: 'Aviation and Aerospace',
      },
      {
        name: 'Defense and Space',
      },
      {
        name: 'Design',
      },
      {
        name: 'Import and Export',
      },
      {
        name: 'International Trade and Development',
      },
      {
        name: 'Maritime',
      },
      {
        name: 'Printing',
      },
      {
        name: 'Textiles',
      },
      {
        name: 'Veterinary',
      },
    ])
  }

  public async down() {
    await Industry.query().delete()
  }
}
