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

Route.on('/email').render('emails/shortlist_applicant')

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
    Route.post(
      '/complete-registration',
      'Registration/RegistrationController.completeCompanyRegistration'
    )
  }).middleware(['auth:jwt'])

  // Route.group(() => {
  Route.post('/account/resend-code', 'Verification/VerificationController.resendVerificationCode')
  Route.post('/password/forgot', 'Password/PasswordController.forgotPassword')
  Route.post('/password/verify-code', 'Password/PasswordController.verifyResetPasswordCode')
  Route.put('/password/reset', 'Password/PasswordController.resetPassword')

  Route.group(() => {
    Route.put('/password/change', 'Password/PasswordController.changePassword')
  }).middleware(['auth:jwt'])

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
    Route.post('/employees/bulk', 'Employee/EmployeesController.addBulkEmployee')
    Route.post('/employees/bulk/retry', 'Employee/EmployeesController.retryAddBulkEmployee')
    Route.put(
      '/employees/:userId/personal-details',
      'Employee/EmployeesController.updateEmployeePersonalDetails'
    )
    Route.put(
      '/employees/:userId/contact-details',
      'Employee/EmployeesController.updateEmployeeContactDetails'
    )
    Route.put(
      '/employees/:userId/next-of-kins',
      'Employee/EmployeesController.updateEmployeeNextOfKin'
    )
    Route.put(
      '/employees/:userId/employment-infos',
      'Employee/EmployeesController.updateEmployeeEmploymentInfo'
    )
    Route.post('/employees/:userId/educations', 'Employee/EmployeesController.addEmployeeEducation')
    Route.post(
      '/employees/:userId/work-experiences',
      'Employee/EmployeesController.addEmployeeWorkExperience'
    )
    Route.post(
      '/employees/:userId/license-or-certifications',
      'Employee/EmployeesController.addEmployeeLicenseOrCertification'
    )

    Route.put('/employees/:userId/salary', 'Employee/EmployeesController.updateEmployeeSalary')

    Route.put(
      '/employees/:userId/educations/:educationId',
      'Employee/EmployeesController.updateEmployeeEducation'
    )
    Route.put(
      '/employees/:userId/work-experiences/:workExperienceId',
      'Employee/EmployeesController.updateEmployeeWorkExperience'
    )
    Route.put(
      '/employees/:userId/license-or-certifications/:licenseId',
      'Employee/EmployeesController.updateEmployeeLicenseOrCertification'
    )

    Route.put(
      '/employees/:userId/employment-status/',
      'Employee/EmployeesController.setEmployeeEmploymentStatus'
    )

    Route.get('/employees/:companyId', 'Employee/EmployeesController.fetchAllCompanyEmployees')
    Route.get(
      '/employees/:companyId/employee/:userId',
      'Employee/EmployeesController.fetchSingleCompanyEmployee'
    )
    Route.put(
      '/employees/:userId/set-profile-picture',
      'Employee/EmployeesController.setEmployeeProfilePicture'
    )
  }).middleware(['auth:jwt', 'subdomain'])

  // COMPANIES ROUTES
  Route.get('/companies/subdomain/:subdomain', 'Company/CompaniesController.getCompanyBySubdomain')
  Route.group(() => {
    Route.get('/companies/:companyId', 'Company/CompaniesController.getCompanyById')
    Route.get('/companies', 'Company/CompaniesController.fetchAllCompanies')
    Route.put('/companies/:companyId/status', 'Company/CompaniesController.updateCompanyStatus')
    Route.put('/companies/:companyId', 'Company/CompaniesController.updateCompanyDetails')
  }).middleware(['auth:jwt'])

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

  // USER LEAVE
  Route.group(() => {
    Route.get('/employee/leaves', 'Leave/UserLeavesController.fetchAllEmployeeLeaves')
    Route.post('/employee/:userId/leaves/assign', 'Leave/UserLeavesController.assignLeave')
    Route.put('/employee/leaves/:userleaveId/approve', 'Leave/UserLeavesController.approveLeave')
    Route.put('/employee/leaves/:userleaveId/reject', 'Leave/UserLeavesController.rejectLeave')
    Route.post('/employee/leaves/request', 'Leave/UserLeavesController.requestLeave')
    Route.get('/employee/leaves/me', 'Leave/UserLeavesController.fetchEmployeeLeaves')
  }).middleware(['auth:jwt', 'subdomain'])

  // JOB CATEGORY ROUTES
  Route.group(() => {
    Route.get('/job-categories', 'JobCategory/JobCategoriesController.fetchAllJobCategory')
    Route.post('/job-categories', 'JobCategory/JobCategoriesController.createJobCategory')
    Route.put(
      '/job-categories/:jobCategoryId',
      'JobCategory/JobCategoriesController.updateJobCategory'
    )
    Route.delete(
      '/job-categories/:jobCategoryId',
      'JobCategory/JobCategoriesController.deleteJobCategory'
    )
  }).middleware(['auth:jwt', 'subdomain'])

  // HIRING ROUTES
  Route.group(() => {
    Route.get('/vacancies', 'Hiring/VacanciesController.getAllVacancies')
    Route.get('/vacancies/:vacancyId', 'Hiring/VacanciesController.getVacancyById')
    Route.post('/vacancies', 'Hiring/VacanciesController.createVacancy')
    Route.put('/vacancies/:vacancyId', 'Hiring/VacanciesController.updateVacancy')
    Route.delete('/vacancies/:vacancyId', 'Hiring/VacanciesController.deleteVacancy')
  }).middleware(['auth:jwt', 'subdomain'])

  Route.group(() => {
    Route.get('/vacancies/slug/:slug', 'Hiring/VacanciesController.getVacancyBySlug')
    Route.get('/vacancies/published/all', 'Hiring/VacanciesController.getAllPublishedVacancies')
  }).middleware(['subdomain'])
  
  Route.post(
    '/vacancies/:vacancyId/apply',
    'Hiring/VacanciesController.applyForVacancy'
  ).middleware(['subdomain'])

  Route.group(() => {
    Route.get('/applicants', 'Hiring/ApplicantsController.getAllApplicants')
    Route.get('/applicants/:applicantId', 'Hiring/ApplicantsController.getApplicantById')
    Route.post('/vacancies/:vacancyId/applicants', 'Hiring/ApplicantsController.createApplicant')
    Route.put('/applicants/:applicantId', 'Hiring/ApplicantsController.updateApplicant')
    Route.delete('/applicants/:applicantId', 'Hiring/ApplicantsController.deleteApplicant')
    Route.put(
      '/applicants/:applicantId/shortlist',
      'Hiring/ApplicantsController.shortlistApplicant'
    )
    Route.put('/applicants/:applicantId/reject', 'Hiring/ApplicantsController.rejectApplicant')
  }).middleware(['auth:jwt', 'subdomain'])

  Route.group(() => {
    Route.get('/components', 'Compensation/ComponentsController.fetchAllComponents')
    Route.get('/components/:componentId', 'Compensation/ComponentsController.getComponentById')
    Route.post('/components', 'Compensation/ComponentsController.createComponent')
    Route.put('/components/:componentId', 'Compensation/ComponentsController.updateComponent')
    Route.delete('/components/:componentId', 'Compensation/ComponentsController.deleteComponent')
    Route.post('/components/user/:userId', 'Compensation/ComponentsController.addComponentsToUser')
    Route.get('/components/user/:userId', 'Compensation/ComponentsController.fetchUserComponents')
  }).middleware(['auth:jwt', 'subdomain'])
}).prefix('/api/v1')
