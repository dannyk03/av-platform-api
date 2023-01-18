import { registerAs } from '@nestjs/config';

import { EnumAppEnv, EnumAppMode } from '@avo/type';

import { version } from 'package.json';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    isProduction: process.env.APP_ENV === EnumAppEnv.Production,
    isStaging: process.env.APP_ENV === EnumAppEnv.Staging,
    isDevelopment: process.env.APP_ENV === EnumAppEnv.Development,
    isCI: process.env.CI === 'true',
    isMigration: process.env.MIGRATION === 'true',
    isSecureMode: process.env.APP_MODE === EnumAppMode.Secure,
    runSeeds: true,
    name: process.env.APP_NAME || 'platform',
    env: process.env.APP_ENV || EnumAppEnv.Development,
    mode: process.env.APP_MODE || EnumAppMode.Secure,
    language: process.env.APP_LANGUAGE || 'en',
    timezone: process.env.APP_TZ || 'Asia/Jerusalem',

    version: process.env.APP_VERSION || '1',
    repoVersion: version,

    http: {
      host: process.env.APP_HOST || 'localhost',
      port: Number.parseInt(process.env.APP_PORT) || 3001,
    },
    globalPrefix: '/api',
    versioning: {
      on: process.env.APP_VERSIONING === 'true',
      prefix: 'v',
    },

    httpOn: process.env.APP_HTTP_ON === 'true',
    jobOn: process.env.APP_JOB_ON === 'true',
    frontEndOrigin: process.env.FE_ORIGIN || 'http://localhost:3000',
  }),
);
