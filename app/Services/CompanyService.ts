import HolidayType from 'App/Models/HolidayType'
import LeaveType from 'App/Models/LeaveType'

export default class CompanyService {
  public static async addCompanyLeaveTypes(companyId: string) {
    try {
      const leaveTypes = [
        'Annual Leave (Vacation Leave)',
        'Sick Leave',
        'Paid Time Off (PTO)',
        'Maternity Leave',
        'Paternity Leave',
        'Parental Leave',
        'Bereavement Leave',
        'Public Holidays',
        'Personal Leave',
        'Educational Leave',
        'Unpaid Leave',
        'Sabbatical Leave',
        'Military Leave',
        'Jury Duty Leave',
        'Family and Medical Leave',
      ]

      const payload = leaveTypes.map((leaveType) => {
        return {
          name: leaveType,
          companyId,
        }
      })
      await LeaveType.createMany(payload)
    } catch (error) {
      console.log('addCompanyLeaveTypes =>', error)
    }
  }

  public static async addCompanyHolidayTypes(companyId: string) {
    try {
      const holidayTypes = [
        {
          name: 'Independence Day',
          date: '0000-10-01',
          isFullDay: true,
        },
        {
          name: `New Year's Day`,
          date: '0000-01-01',
          isFullDay: true,
        },
        {
          name: `Worker's Day`,
          date: '0000-05-01',
          isFullDay: true,
        },
        {
          name: `Democracy Day`,
          date: '0000-06-12',
          isFullDay: true,
        },
        {
          name: `Christmas Day`,
          date: '0000-12-25',
          isFullDay: true,
        },
        {
          name: `Boxing Day`,
          date: '0000-12-26',
          isFullDay: true,
        }
      ]

      const payload = holidayTypes.map((holidayType) => {
        return {
          companyId,
          ...holidayType,
        }
      })
      await HolidayType.createMany(payload)
    } catch (error) {
      console.log('addCompanyHolidayTypes =>', error)
    }
  }
}
