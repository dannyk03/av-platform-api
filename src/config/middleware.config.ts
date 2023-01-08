import { registerAs } from '@nestjs/config';

import ms from 'ms';

import { EnumRequestMethod } from '@/utils/request/constant';

export default registerAs(
  'middleware',
  (): Record<string, any> => ({
    cors: {
      allowMethod: [
        EnumRequestMethod.GET,
        EnumRequestMethod.DELETE,
        EnumRequestMethod.PUT,
        EnumRequestMethod.PATCH,
        EnumRequestMethod.POST,
      ],
      allowOriginProduction: [
        /^https:\/\/gifting\.avonow\.com$/,
        /^https:\/\/connect\.avonow\.com$/,
      ],
      allowOriginStaging: [
        /^https:\/\/staging--avo-*\.netlify\.app$/,
        /^https:\/\/*--avo-connect-staging\.netlify\.app$/,
      ],
      allowOriginFeatureBranches: [
        /^https:\/\[a-z0-9-._]+--avo-gifting\.netlify\.app$/,
      ],
      allowOriginLocalhost: [/^https?:\/\/localhost:3000$/],
      allowHeader: [
        'Accept',
        'Accept-Language',
        'Content-Language',
        'Content-Type',
        'Origin',
        'Authorization',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Credentials',
        'Access-Control-Expose-Headers',
        'Access-Control-Max-Age',
        'Referer',
        'Host',
        'X-Requested-With',
        'x-custom-lang',
        'x-timestamp',
        'x-timezone',
        'x-correlation-id',
        'X-Response-Time',
        'user-agent',
      ],
    },
    rateLimit: {
      resetTime: '0.5', // secs
      maxRequestPerIp: 2, // max request per reset time
    },
    timestamp: {
      toleranceTimeInMs: process.env.MIDDLEWARE_TOLERANCE_TIMESTAMP
        ? ms(process.env.MIDDLEWARE_TOLERANCE_TIMESTAMP)
        : ms('5m'), // 5 mins
    },
    cache: {
      ttl: ms('30s'), // 30sec
      max: 100, // maximum number of items in cache,
    },
    timeout: {
      in: process.env.MIDDLEWARE_TIMEOUT
        ? ms(process.env.MIDDLEWARE_TIMEOUT)
        : ms('30s'), // 30s based on ms module
    },
  }),
);
