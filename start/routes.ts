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

// Route.on('/email').render('emails/reset_password')

Route.group(() => {
  Route.get('/', async () => {
    return { welcome: 'Heasyresource API' }
  })
  Route.post('/validate/company-info', 'Registration/RegistrationController.validateCompanyInfo')
  Route.post('/register', 'Registration/RegistrationController.register')
  Route.post('/login', 'Authentication/LoginController.login')
  Route.post('/refresh', 'Authentication/LoginController.refreshToken')
  Route.post('/account/verify', 'Verification/VerificationController.verifyAccount')

    Route.group(() => {
      Route.post('/complete-registration', 'Registration/RegistrationController.completeCompanyRegistration')
    }).middleware(['auth:jwt'])

  Route.group(() => {
    Route.post('/account/resend-code', 'Verification/VerificationController.resendVerificationCode')
    Route.post('/password/forgot', 'Password/PasswordController.forgotPassword')
    Route.post('/password/verify-code', 'Password/PasswordController.verifyResetPasswordCode')
    Route.put('/password/reset', 'Password/PasswordController.resetPassword')
  }).middleware(['subdomain'])

  // DEPARTMENTS ROUTES
  Route.group(() => {
    Route.get('/departments', 'Department/DepartmentsController.fetchAllDepartment')
    Route.post('/departments', 'Department/DepartmentsController.createDepartment')
    Route.put('/departments/:id', 'Department/DepartmentsController.updateDepartment')
    Route.delete('/departments/:id', 'Department/DepartmentsController.deleteDepartment')
    Route.post('/departments/multiple', 'Department/DepartmentsController.createMultipleDepartment')

  }).middleware(['auth:jwt', 'subdomain'])

  // METADATA ROUTE
  Route.get('/metadata', 'MetaData/MetaDataController.metadata')

  // HOLIDAY ROUTES
  Route.group(() => {
    Route.get('/holidays', 'Holiday/HolidayTypesController.fetchAllHoliday')
    Route.post('/holidays', 'Holiday/HolidayTypesController.createHoliday')
    Route.put('/holidays/:id', 'Holiday/HolidayTypesController.updateHoliday')
    Route.delete('/holidays/:id', 'Holiday/HolidayTypesController.deleteHoliday')
  }).middleware(['auth:jwt', 'subdomain'])

  // LEAVE ROUTES
  Route.group(() => {
    Route.get('/leave', 'Leave/LeaveTypesController.fetchAllLeaveTypes')
    Route.post('/leave', 'Leave/LeaveTypesController.createLeaveType')
    Route.put('/leave/:id', 'Leave/LeaveTypesController.updateLeaveType')
    Route.delete('/leave/:id', 'Leave/LeaveTypesController.deleteLeaveType')
  }).middleware(['auth:jwt', 'subdomain'])
}).prefix('/api/v1')
