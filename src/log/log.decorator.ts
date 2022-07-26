import { UseInterceptors, applyDecorators } from '@nestjs/common';

import { LogInterceptor } from './interceptor/log.interceptor';
import { EnumLogAction } from './log.constant';
import { ILogOptions } from './log.interface';

export function LogTrace(action: EnumLogAction, options?: ILogOptions): any {
  return applyDecorators(UseInterceptors(LogInterceptor(action, options)));
}
