/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  HOST: Env.schema.string.optional({ format: 'host' }),
  PORT: Env.schema.number.optional(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  DRIVE_DISK: Env.schema.enum(['local'] as const),
  NODE_ENV: Env.schema.enum.optional(['development', 'production', 'test'] as const),
  // MYSQL_HOST: Env.schema.string({ format: 'host' }),
  // MYSQL_PORT: Env.schema.number(),
  // MYSQL_USER: Env.schema.string(),
  // MYSQL_PASSWORD: Env.schema.string.optional(),
  // MYSQL_DB_NAME: Env.schema.string(),
  SMTP_HOST: Env.schema.string({ format: 'host' }),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),
  VERIFICATION_CODE_EXPIRY_TIME_IN_MS: Env.schema.number(),
  VERIFICATION_CODE_RETRY_TIME_IN_MS: Env.schema.number(),
  JWT_PRIVATE_KEY: Env.schema.string(),
  JWT_PUBLIC_KEY: Env.schema.string(),
  QUEUE_REDIS_HOST: Env.schema.string({ format: 'host' }),
  QUEUE_REDIS_PORT: Env.schema.number(),
  QUEUE_REDIS_PASSWORD: Env.schema.string.optional(),
})
