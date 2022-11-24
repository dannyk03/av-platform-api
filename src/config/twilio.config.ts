import { registerAs } from '@nestjs/config';

export default registerAs(
  'twilio',
  (): Record<string, any> => ({
    logLevel: process.env.TWILIO_DEBUG === 'true' ? 'debug' : 'none',
    apiKey: process.env.TWILIO_API_KEY,
    apiSecretKey: process.env.TWILIO_API_SECRET_KEY,
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    dev: {
      nonProdMagicOTP: '123456',
    },
    service: {
      verify: {
        otp: {
          // cspell:disable-next-line
          sid: 'VAea42051eb2fb3b6518ab3f9042d5ceb7',
          channel: 'sms',
          codeLength: 6,
        },
      },
    },
  }),
);
