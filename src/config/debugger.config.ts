import { registerAs } from '@nestjs/config';

import ms from 'ms';

export default registerAs(
  'debugger',
  (): Record<string, any> => ({
    http: {
      writeIntoFile: process.env.DEBUGGER_HTTP_WRITE_INTO_FILE === 'true',
      writeIntoConsole: process.env.DEBUGGER_HTTP_WRITE_INTO_CONSOLE === 'true',
      maxFiles: 5,
      maxSize: '5M',
    },
    system: {
      writeIntoFile: process.env.DEBUGGER_SYSTEM_WRITE_INTO_FILE === 'true',
      writeIntoConsole:
        process.env.DEBUGGER_SYSTEM_WRITE_INTO_CONSOLE === 'true',
      maxFiles: ms('7d'),
      maxSize: '5m',
    },
  }),
);
