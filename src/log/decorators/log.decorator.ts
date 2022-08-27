import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';

import { ILogOptions } from '../types/log.interface';

import { EnumLogAction } from '../constants';
import {
  LOG_ACTION_META_KEY,
  LOG_OPTIONS_META_KEY,
} from '../constants/log.constant';

import { LogInterceptor } from '../interceptor/log.interceptor';

export function LogTrace(action: EnumLogAction, options?: ILogOptions): any {
  return applyDecorators(
    UseInterceptors(LogInterceptor),
    SetMetadata(LOG_ACTION_META_KEY, action),
    SetMetadata(LOG_OPTIONS_META_KEY, options ? options : {}),
  );
}
