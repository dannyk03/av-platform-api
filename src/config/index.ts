import { ConfigModule } from '@nestjs/config';

import Joi from 'joi';

import { EnumMessageLanguage } from '@/response-message';

import AppConfig from './app.config';
import AuthConfig from './auth.config';
import AwsConfig from './aws.config';
import CloudinaryConfig from './cloudinary.config';
import CustomerIoConfig from './customer-io.config';
import DatabaseConfig from './database.config';
import FileConfig from './file.config';
import HelperConfig from './helper.config';
import MiddlewareConfig from './middleware.config';
import OrganizationConfig from './organization.config';
import StripeConfig from './stripe.config';
import UserConfig from './user.config';

const Configs = [
  AppConfig,
  AuthConfig,
  DatabaseConfig,
  HelperConfig,
  AwsConfig,
  UserConfig,
  MiddlewareConfig,
  FileConfig,
  OrganizationConfig,
  CloudinaryConfig,
  CustomerIoConfig,
  StripeConfig,
];

export const ConfigDynamicModule = ConfigModule.forRoot({
  load: Configs,
  ignoreEnvFile: false,
  isGlobal: true,
  cache: true,
  envFilePath: ['.env'],
  expandVariables: true,
  validationSchema: Joi.object({
    APP_NAME: Joi.string().required(),
    APP_ENV: Joi.string()
      .valid('development', 'production')
      .default('development')
      .required(),
    APP_MODE: Joi.string()
      .valid('simple', 'secure')
      .default('simple')
      .required(),
    APP_LANGUAGE: Joi.string()
      .valid(...Object.values(EnumMessageLanguage))
      .default('en')
      .required(),
    APP_TZ: Joi.any().default('Asia/Jerusalem').required(),

    APP_HOST: [
      Joi.string().ip({ version: 'ipv4' }).required(),
      Joi.valid('localhost').required(),
    ],
    APP_PORT: Joi.number().default(3001).required(),
    APP_VERSIONING: Joi.boolean().default(true).required(),
    APP_DEBUG: Joi.boolean().default(true).required(),

    APP_HTTP_ON: Joi.boolean().default(true).required(),
    APP_JOB_ON: Joi.boolean().default(false).required(),

    POSTGRES_HOST: Joi.any().default('localhost').required(),
    POSTGRES_PORT: Joi.any().default(5432).required(),
    POSTGRES_DB: Joi.any().default('avo').required(),
    POSTGRES_USER: Joi.any().optional(),
    POSTGRES_PASSWORD: Joi.any().optional(),
    DATABASE_DEBUG: Joi.boolean().default(false).required(),

    MIDDLEWARE_TOLERANCE_TIMESTAMP: Joi.string().default('5m').required(),
    MIDDLEWARE_TIMEOUT: Joi.string().default('30s').required(),

    AUTH_JWT_AUDIENCE: Joi.string().required(),
    AUTH_JWT_ISSUER: Joi.string().required(),
    AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string()
      .alphanum()
      .min(5)
      .max(50)
      .required(),
    AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string().default('30m').required(),
    AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string()
      .alphanum()
      .min(5)
      .max(50)
      .required(),
    AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string().default('7d').required(),
    AUTH_JWT_REFRESH_TOKEN_REMEMBER_ME_EXPIRED: Joi.string()
      .default('30d')
      .required(),
    AUTH_JWT_REFRESH_TOKEN_NOT_BEFORE_EXPIRATION: Joi.string().required(),
    AUTH_SYSTEM_ADMIN_EMAIL: Joi.string().required(),
    AUTH_SYSTEM_ADMIN_INITIAL_PASS: Joi.string().required(),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
});
