import { registerAs } from '@nestjs/config';

export default registerAs(
  'twilio',
  (): Record<string, any> => ({
    logLevel: process.env.TWILIO_DEBUG === 'true' ? 'debug' : 'none',
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    dev: {
      nonProdMagicOTP: '123456',
    },
    service: {
      verify: {
        otp: {
          sid: 'VA237b16b9be417d5e1e17b9e3f7a4f92e',
          channel: 'sms',
          codeLength: 6,
        },
      },
    },
  }),
);
