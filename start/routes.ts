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

    // EMPLOYEE ROUTES
    Route.group(() => {
      Route.post('/employees', 'Employee/EmployeesController.addEmployee')
      Route.put('/employees/:userId/personal-details', 'Employee/EmployeesController.updateEmployeePersonalDetails')
      Route.put('/employees/:userId/contact-details', 'Employee/EmployeesController.updateEmployeeContactDetails')
      Route.put('/employees/:userId/next-of-kins', 'Employee/EmployeesController.updateEmployeeNextOfKin')
      Route.put('/employees/:userId/employment-infos', 'Employee/EmployeesController.updateEmployeeEmploymentInfo')
      Route.get('/employees/:companyId', 'Employee/EmployeesController.fetchAllCompanyEmployees')
    }).middleware(['auth:jwt', 'subdomain'])


    // COMPANIES ROUTES
    Route.group(() => {
      Route.get('/companies/:companyId', 'Company/CompaniesController.getCompanyById')
      Route.get('/companies/subdomain/:subdomain', 'Company/CompaniesController.getCompanyBySubdomain')
      Route.get('/companies', 'Company/CompaniesController.fetchAllCompanies')
    }).middleware(['auth:jwt', 'subdomain'])

  // METADATA ROUTE
  Route.get('/metadata', 'MetaData/MetaDataController.metadata')

  // HOLIDAY ROUTES
  Route.group(() => {
    Route.get('/holiday-types', 'Holiday/HolidayTypesController.fetchAllHoliday')
    Route.post('/holiday-types', 'Holiday/HolidayTypesController.createHoliday')
    Route.put('/holiday-types/:id', 'Holiday/HolidayTypesController.updateHoliday')
    Route.delete('/holiday-types/:id', 'Holiday/HolidayTypesController.deleteHoliday')
  }).middleware(['auth:jwt', 'subdomain'])

  // LEAVE ROUTES
  Route.group(() => {
    Route.get('/leave-types', 'Leave/LeaveTypesController.fetchAllLeaveTypes')
    Route.post('/leave-types', 'Leave/LeaveTypesController.createLeaveType')
    Route.put('/leave-types/:id', 'Leave/LeaveTypesController.updateLeaveType')
    Route.delete('/leave-types/:id', 'Leave/LeaveTypesController.deleteLeaveType')
  }).middleware(['auth:jwt', 'subdomain'])
}).prefix('/api/v1')
