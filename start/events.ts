/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Event from '@ioc:Adonis/Core/Event'
import CompanyService from 'App/Services/CompanyService'
import UserService from 'App/Services/UserService'

Event.on('mail:sent', async ({ message }) => {
  console.log(message.subject)
  const userEmail = message.to?.[0].address
  if (userEmail) UserService.setVerificationSentTime(userEmail)
})

Event.on('new:company', async ({ companyId }) => {
  await CompanyService.addCompanyLeaveTypes(companyId)
  await CompanyService.addCompanyHolidayTypes(companyId)
  console.log('Added Leave Types and Holiday Types')
})
