import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import HolidayType from 'App/Models/HolidayType'

export default class extends BaseSchema {
  public async up() {
    // await HolidayType.createMany([
    //   {
    //     name: 'Independence Day',
    //     date: new Date('0000-10-01'),
    //     isFullDay: true,
    //   },
    //   {
    //     name: `New Year's Day`,
    //     date: new Date('0000-01-01'),
    //     isFullDay: true,
    //   },
    //   {
    //     name: `Worker's Day`,
    //     date: new Date('0000-05-01'),
    //     isFullDay: true,
    //   },
    //   {
    //     name: `Democracy Day`,
    //     date: new Date('0000-06-12'),
    //     isFullDay: true,
    //   },
    //   {
    //     name: `Christmas Day`,
    //     date: new Date('0000-12-25'),
    //     isFullDay: true,
    //   },
    //   {
    //     name: `Boxing Day`,
    //     date: new Date('0000-12-26'),
    //     isFullDay: true,
    //   },
    //   {
    //     name: `Eid Al-Adha`,
    //     date: new Date('0000-00-00'),
    //     isFullDay: true,
    //   },
    //   {
    //     name: `Eid Al-Fitr`,
    //     date: new Date('0000-00-00'),
    //     isFullDay: true,
    //   },
    //   {
    //     name: `Easter Monday`,
    //     date: new Date('0000-00-00'),
    //     isFullDay: true,
    //   },
    //   {
    //     name: `Good Friday`,
    //     date: new Date('0000-00-00'),
    //     isFullDay: true,
    //   },
    //   {
    //     name: `Ramadan`,
    //     date: new Date('0000-00-00'),
    //     isFullDay: true,
    //   },
    //   {
    //     name: `Eid Al-Kabir`,
    //     date: new Date('0000-00-00'),
    //     isFullDay: true,
    //   },
    //   {
    //     name: `Id Maoulud`,
    //     date: new Date('0000-00-00'),
    //     isFullDay: true,
    //   },
    // ])
  }

  public async down() {
    await HolidayType.query().delete()
  }
}
