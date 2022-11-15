import { registerAs } from '@nestjs/config';

import { EnumAppEnv } from '@avo/type';

export default registerAs(
  'user',
  (): Record<string, any> => ({
    uploadPath:
      process.env.APP_ENV === EnumAppEnv.Production ? '/user' : '/test/user',
    signUpCodeExpiresInDays: 7,
  }),
);
