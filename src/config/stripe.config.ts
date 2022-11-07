import { registerAs } from '@nestjs/config';

export default registerAs(
  'stripe',
  (): Record<string, any> => ({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecretKey: process.env.STRIPE_WEBHOOK_SECRET_KEY,
  }),
);
