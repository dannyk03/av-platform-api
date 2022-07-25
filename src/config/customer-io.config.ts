import { registerAs } from '@nestjs/config';

export default registerAs(
  'customer-io',
  (): Record<string, any> => ({
    url: `https://api.customer.io/v1/transactional`,
  }),
);
