import User from 'App/Models/User'

export default class UserService {
  public static async setVerificationSentTime(email: string) {
    await User.query().where('email', email).update({
      verificationCodeSentAt: new Date(),
    })
  }
}
