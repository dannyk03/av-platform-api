import { User } from '@/user/entity';
import { EnumLoggerAction } from './log.constant';
import { IResult } from 'ua-parser-js';
import { EntityManager } from 'typeorm';

export interface IReqLogData {
  correlationId: string;
  originalUrl: string;
  userAgent: IResult;
  method: string;
}

export interface ILog {
  transactionalEntityManager?: EntityManager;
  correlationId: string;
  originalUrl: string;
  description: string;
  userAgent?: IResult;
  method?: string;
  action?: EnumLoggerAction;
  user?: User;
  tags?: string[];
}
