import { Inject, Injectable } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { IDebuggerLog } from '../debugger.interface';

@Injectable()
export class DebuggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  info(correlationId: string, log: IDebuggerLog, data?: any): void {
    this.logger.info(log.description, {
      correlationId,
      class: log.class,
      function: log.function,
      path: log.path,
      data,
    });
  }

  debug(correlationId: string, log: IDebuggerLog, data?: any): void {
    this.logger.debug(log.description, {
      correlationId,
      class: log.class,
      function: log.function,
      path: log.path,
      data,
    });
  }

  warn(correlationId: string, log: IDebuggerLog, data?: any): void {
    this.logger.warn(log.description, {
      correlationId,
      class: log.class,
      function: log.function,
      path: log.path,
      data,
    });
  }

  error(correlationId: string, log: IDebuggerLog, data?: any): void {
    this.logger.error(log.description, {
      correlationId,
      class: log.class,
      function: log.function,
      path: log.path,
      data,
    });
  }
}
