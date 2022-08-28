import { IResult } from 'ua-parser-js';

import { AclRole } from '@/access-control-list/role/entity';
import { User } from '@/user/entity';

import { EnumLogAction, EnumLogLevel } from '../constants';
import { EnumRequestMethod } from '@/utils/request/constants';

export interface ILog extends ILogData, IReqLogData {}
export interface ILogData {
  description: string;
  action: EnumLogAction;

  tags?: string[];
  data?: Record<string, any>;
}

export interface IReqLogData {
  path: string;
  role?: AclRole;
  method: EnumRequestMethod;
  params?: Record<string, any>;
  body?: Record<string, any>;
  user?: User;
  correlationId: string;
  userAgent: IResult;
  version?: string;
  repoVersion: string;
}

export interface ILogRaw extends ILog {
  level: EnumLogLevel;
  statusCode?: number;
}

export interface ILogOptions {
  description?: string;
  tags?: string[];
  level?: EnumLogLevel;
}
