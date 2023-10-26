import Company from "App/Models/Company";

declare module '@ioc:Adonis/Core/Request' {
    interface RequestContract {
      tenant: Company
    }
}