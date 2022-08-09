import { registerAs } from '@nestjs/config';

import bytes from 'bytes';

export default registerAs(
  'file',
  (): Record<string, any> => ({
    image: {
      maxFileSize: bytes('100kb'), // 100 KB
      maxFiles: 3,
    },
    excel: {
      maxFileSize: bytes('1mb'), // 100 KB
      maxFiles: 3,
    },
  }),
);
