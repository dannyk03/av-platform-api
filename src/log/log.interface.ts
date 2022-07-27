import { IResult } from 'ua-parser-js';

import { AclRole } from '@/access-control-list/role/entity';
import { User } from '@/user/entity';

import { EnumRequestMethod } from '@/utils/request';

import { EnumLogAction, EnumLogLevel } from './log.constant';

export interface ILog {
  originalUrl: string;
  description: string;
  action: EnumLogAction;
  role?: AclRole;
  method: EnumRequestMethod;
  tags?: string[];
  params?: Record<string, any>;
  bodies?: Record<string, any>;
  statusCode?: number;
  user?: User;
  correlationId: string;
  userAgent: IResult;
  version?: string;
}

export interface ILogOptions {
  description?: string;
  tags?: string[];
  level?: EnumLogLevel;
}
