import { UseInterceptors, applyDecorators } from '@nestjs/common';

import { ILogOptions } from './log.interface';

import { LogInterceptor } from './interceptor/log.interceptor';
import { EnumLogAction } from './log.constant';

export function LogTrace(action: EnumLogAction, options?: ILogOptions): any {
  return applyDecorators(UseInterceptors(LogInterceptor(action, options)));
}
