import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';

import { ILogOptions } from '../type/log.interface';

import { EnumLogAction } from '../constant';
import {
  LOG_ACTION_META_KEY,
  LOG_OPTIONS_META_KEY,
} from '../constant/log.constant';

import { LogInterceptor } from '../interceptor/log.interceptor';

export function LogTrace(
  action: EnumLogAction | ((body: Record<string, any>) => EnumLogAction),
  options?: ILogOptions,
): any {
  return applyDecorators(
    UseInterceptors(LogInterceptor),
    SetMetadata(LOG_ACTION_META_KEY, action),
    SetMetadata(LOG_OPTIONS_META_KEY, options ? options : {}),
  );
}
