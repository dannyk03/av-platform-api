import { User } from '@/user/entity/user.entity';
import { EnumLoggerAction } from './log.constant';
import { IResult } from 'ua-parser-js';

export interface IReqLogData {
  correlationId: string;
  originalUrl: string;
  userAgent: IResult;
  method: string;
}

export interface ILog {
  correlationId: string;
  originalUrl: string;
  description: string;
  userAgent?: IResult;
  method?: string;
  action?: EnumLoggerAction;
  user?: User;
  tags?: string[];
}
