import { EntityManager } from 'typeorm';
import { IResult } from 'ua-parser-js';

import { AclRole } from '@/access-control-list/role/entity';
import { User } from '@/user/entity';

import { EnumRequestMethod } from '@/utils/request';

import { EnumLogAction, EnumLogLevel } from './log.constant';

export interface IReqLogData {
  correlationId: string;
  originalUrl: string;
  userAgent: IResult;
  method: EnumRequestMethod;
}

export interface ILog {
  transactionalEntityManager?: EntityManager;
  correlationId: string;
  originalUrl: string;
  description: string;
  userAgent: IResult;
  action: EnumLogAction;
  user?: User;
  role?: AclRole;
  method: EnumRequestMethod;
  tags?: string[];
  params?: Record<string, any>;
  bodies?: Record<string, any>;
  statusCode?: number;
}

export interface ILogOptions {
  description?: string;
  tags?: string[];
  level?: EnumLogLevel;
}
