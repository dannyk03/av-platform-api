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
          sid: 'VA6f0d385e0bfc36efed6019991a57353d',
          channel: 'sms',
          codeLength: 6,
        },
      },
    },
  }),
);
