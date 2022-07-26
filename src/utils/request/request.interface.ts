import { Request } from 'express';
import { IResult } from 'ua-parser-js';

import { User } from '@/user/entity';

export interface IRequestApp extends Request {
  correlationId: string;
  timezone: string;
  timestamp?: string;
  userAgent?: IResult;
  customLang: string;
  user?: Record<string, any>;
  version?: string;
  __user?: User;
  __class: string;
  __function: string;
}
