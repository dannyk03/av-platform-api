import { registerAs } from '@nestjs/config';
import ms from 'ms';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    isProduction: process.env.APP_NAME === 'production',
    isSecureMode: process.env.APP_MODE === 'secure',
    name: process.env.APP_NAME || 'ack',
    env: process.env.APP_ENV || 'development',
    mode: process.env.APP_MODE || 'simple',
    language: process.env.APP_LANGUAGE || 'en',
    timezone: process.env.APP_TZ || 'Asia/Jakarta',

    http: {
      host: process.env.APP_HOST || 'localhost',
      port: Number.parseInt(process.env.APP_PORT) || 3000,
    },
    globalPrefix: '/api',
    versioning: {
      on: process.env.APP_VERSIONING === 'true',
      prefix: 'v',
    },
    debug: process.env.APP_DEBUG === 'true',
    debugger: {
      http: {
        maxFiles: 5,
        maxSize: '2M',
      },
      system: {
        active: false,
        maxFiles: ms('7d'),
        maxSize: '2m',
      },
    },

    httpOn: process.env.APP_HTTP_ON === 'true',
    taskOn: process.env.APP_TASK_ON === 'true',
  }),
);
