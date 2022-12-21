import { registerAs } from '@nestjs/config';

export default registerAs(
  'group',
  (): Record<string, any> => ({
    groupInviteCodeExpiresInDays: 99,
  }),
);
