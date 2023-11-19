import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

import Env from '@ioc:Adonis/Core/Env'
import Company from 'App/Models/Company'
import Applicant from 'App/Models/Applicant'
import Vacancy from 'App/Models/Vacancy'

export default class ShortlistOrRejectApplicantEmail extends BaseMailer {
  constructor(
    private applicant: Applicant,
    private company: Company,
    private vacancy: Vacancy
  ) {
    super()
  }
  public prepare(message: MessageContract) {
    const { firstName, lastName, email, status } = this.applicant
    const { name, logoUrl } = this.company
    const { title } = this.vacancy
    const noReplyMailFrom = Env.get('NOREPLY_MAIL_FROM', 'noreply@heasyresource.com')

    message
      .subject(`Your application to ${title} at ${name}`)
      .from(noReplyMailFrom, name)
      .to(email, `${firstName} ${lastName}`)
      .htmlView('emails/shortlist_reject_applicant', {
        companyName: name,
        applicantFirstName: firstName,
        status,
        companyLogo: logoUrl,
      })
  }
}
