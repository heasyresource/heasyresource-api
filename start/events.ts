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
import UserService from 'App/Services/UserService';

Event.on('mail:sent', async ({ message }) => {
  console.log(message.subject);
  const userEmail = message.to?.[0].address;
  if (userEmail) UserService.setVerificationSentTime(userEmail);
})