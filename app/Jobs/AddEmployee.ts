import type { JobHandlerContract, Job } from '@ioc:Rlanz/Queue'
import EmployeeService from 'App/Services/EmployeeService'

export type AddEmployeePayload = {}

export default class implements JobHandlerContract {
	constructor(public job: Job) {
    this.job = job
  }

  /**
   * Base Entry point
   */
  public async handle(payload: AddEmployeePayload) {
    await EmployeeService.saveEmployee(payload)
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  public async failed() {}
}
