import { IResult } from 'ua-parser-js';

import { AclRole } from '@/access-control-list/role/entity';
import { User } from '@/user/entity';

import { EnumLogAction, EnumLogLevel } from '../constants';
import { EnumRequestMethod } from '@/utils/request/constants';

export interface ILog {
  path: string;
  description: string;
  action: EnumLogAction;
  role?: AclRole;
  method: EnumRequestMethod;
  tags?: string[];
  params?: Record<string, any>;
  body?: Record<string, any>;
  statusCode?: number;
  user?: User;
  correlationId: string;
  userAgent: IResult;
  version?: string;
}

export interface ILogRaw extends ILog {
  level: EnumLogLevel;
}

export interface ILogOptions {
  description?: string;
  tags?: string[];
  level?: EnumLogLevel;
}
