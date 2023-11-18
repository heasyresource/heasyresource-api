import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import Company from 'App/Models/Company'

export default class AddEmloyeeEmail extends BaseMailer {
  constructor(
    private user: User,
    private company: Company
  ) {
    super()
  }
  public prepare(message: MessageContract) {
    const { firstName, lastName, email, password } = this.user

    const { name, subdomain, email: companyEmail, logoUrl } = this.company
    const noReplyMailFrom = Env.get('NOREPLY_MAIL_FROM', 'noreply@heasyresource.com')
    // const AppName = Env.get('APP_NAME', 'HeasyResource')
    message
      .subject(`Welcome to ${name} EMS`)
      .from(noReplyMailFrom, name)
      .to(email, `${firstName} ${lastName}`)
      .htmlView('emails/add_employee', {
        companyName: name,
        subdomain,
        companyEmail,
        employeeFirstName: firstName,
        employeeLastName: lastName,
        employeeDefaultPassword: password,
        employeeWorkEmail: email,
        companyLogo: logoUrl
      })
  }
}
