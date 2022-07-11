import { registerAs } from '@nestjs/config';

export default registerAs(
  'organization',
  (): Record<string, any> => ({
    inviteCodeExpiresInDays: 1,
  }),
);
