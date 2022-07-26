import { User } from '$/user/entity';
import { EntityManager } from 'typeorm';
import { IResult } from 'ua-parser-js';
import { EnumLoggerAction } from './log.constant';

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
