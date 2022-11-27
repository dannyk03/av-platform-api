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
          sid: 'VA18a60eb70c1965dbf17c696418ab76f8',
          channel: 'sms',
          codeLength: 6,
        },
      },
    },
  }),
);
