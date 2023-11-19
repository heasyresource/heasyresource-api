import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

import Env from '@ioc:Adonis/Core/Env'
import Company from 'App/Models/Company'
import UserLeave from 'App/Models/UserLeave'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class LeaveStatusEmail extends BaseMailer {
  constructor(
    private user: User,
    private company: Company,
    private leave: UserLeave
  ) {
    super()
  }
  public prepare(message: MessageContract) {
    const { firstName, lastName, email } = this.user
    const { name, logoUrl } = this.company
    const { startDate, endDate, status, reasonForRejection, leaveType } = this.leave
    const leaveTypeName = leaveType.name
    const noReplyMailFrom = Env.get('NOREPLY_MAIL_FROM', 'noreply@heasyresource.com')

    message
      .subject(`${leaveTypeName} Request is ${status}`)
      .from(noReplyMailFrom, name)
      .to(email, `${firstName} ${lastName}`)
      .htmlView('emails/leave', {
        companyName: name,
        employeeFirstName: firstName,
        employeeLastName: lastName,
        companyLogo: logoUrl,
        startDate: DateTime.fromJSDate(new Date(startDate.toString())).toFormat('MMMM dd, yyyy'),
        endDate: DateTime.fromJSDate(new Date(endDate.toString())).toFormat('MMMM dd, yyyy'),
        status,
        reasonForRejection,
        leaveType: leaveTypeName,
      })
  }
}
