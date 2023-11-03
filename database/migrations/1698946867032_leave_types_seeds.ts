import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import LeaveType from 'App/Models/LeaveType'

export default class extends BaseSchema {
  public async up() {
    await LeaveType.createMany([
      {
        name: 'Annual Leave (Vacation Leave)',
      },
      {
        name: 'Sick Leave',
      },
      {
        name: 'Paid Time Off (PTO)',
      },
      {
        name: 'Maternity Leave',
      },
      {
        name: 'Paternity Leave',
      },
      {
        name: 'Parental Leave',
      },
      {
        name: 'Bereavement Leave',
      },
      {
        name: 'Public Holidays',
      },
      {
        name: 'Personal Leave',
      },
      {
        name: 'Educational Leave',
      },
      {
        name: 'Unpaid Leave',
      },
      {
        name: 'Sabbatical Leave',
      },
      {
        name: 'Military Leave',
      },
      {
        name: 'Jury Duty Leave',
      },
      {
        name: 'Family and Medical Leave',
      },
    ])
  }

  public async down() {
    await LeaveType.query().delete()
  }
}
