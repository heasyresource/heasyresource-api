/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { welcome: 'Heasyresource API' }
})

Route.on('/email').render('emails/welcome')

Route.group(() => {
  Route.get('/', async () => {
    return { welcome: 'Heasyresource API' }
  })
  Route.post('/register', 'Registration/RegistrationController.register')
  Route.post('/account/verify', 'Verification/VerificationController.verifyAccount')
  Route.post('/account/resend-code', 'Verification/VerificationController.resendVerificationCode')
  Route.post('/login', 'Authentication/LoginController.login')
  Route.post('/refresh', 'Authentication/LoginController.refreshToken')
  Route.post('/password/forgot', 'Password/PasswordController.forgotPassword')
  Route.post('/password/verify-code', 'Password/PasswordController.verifyResetPasswordCode')
  Route.put('/password/reset', 'Password/PasswordController.resetPassword')

  // DEPARTMENTS ROUTES
  Route.group(() => {
    Route.get('/departments', 'Department/DepartmentsController.fetchAllDepartment')
    Route.post('/departments', 'Department/DepartmentsController.createDepartment')
    Route.put('/departments/:id', 'Department/DepartmentsController.updateDepartment')
    Route.delete('/departments/:id', 'Department/DepartmentsController.deleteDepartment')
  }).middleware(['auth:jwt', 'subdomain'])
}).prefix('/api/v1')
