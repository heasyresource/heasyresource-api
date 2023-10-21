import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'

export default class ResetPassword extends BaseMailer {
  constructor(private user: User) {
    super()
  }
  public prepare(message: MessageContract) {
    const { firstName, lastName, email, verificationCode } = this.user
    const noReplyMailFrom = Env.get('NOREPLY_MAIL_FROM', 'noreply@heasyresource.com');
    const AppName = Env.get('APP_NAME', 'HeasyResource');
    message
      .subject('Reset Your Password')
      .from(noReplyMailFrom, AppName)
      .to(email, `${firstName} ${lastName}`)
      .htmlView('emails/reset_password', { firstName, lastName, verificationCode })
  }
}
