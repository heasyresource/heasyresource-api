import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'

export default class VerifyEmail extends BaseMailer {
  constructor(private user: User, private company) {
    super()
  }
  public prepare(message: MessageContract) {
    const { firstName, lastName, email, verificationCode } = this.user
    const { companyName  } = this.company
    const noReplyMailFrom = Env.get('NOREPLY_MAIL_FROM', 'noreply@heasyresource.com');
    const AppName = Env.get('APP_NAME', 'HeasyResource');
    message
      .subject('Verify Your Account')
      .from(noReplyMailFrom, AppName)
      .to(email, `${firstName} ${lastName}`)
      .htmlView('emails/welcome', { firstName, lastName, verificationCode, companyName })
  }
}
