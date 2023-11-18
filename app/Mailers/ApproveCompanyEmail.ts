import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import Company from 'App/Models/Company'

export default class ApproveCompanyEmail extends BaseMailer {
  constructor(
    private user: User,
    private company: Company
  ) {
    super()
  }
  public prepare(message: MessageContract) {
    const { firstName, lastName, email } = this.user
    const { name, subdomain } = this.company
    const noReplyMailFrom = Env.get('NOREPLY_MAIL_FROM', 'noreply@heasyresource.com')
    const AppName = Env.get('APP_NAME', 'HeasyResource')
    message
      .subject('Your Company is Approved')
      .from(noReplyMailFrom, AppName)
      .to(email, `${firstName} ${lastName}`)
      .htmlView('emails/company_approved', { companyName: name, subdomain })
  }
}
