import { Request } from 'express';
import { IResult } from 'ua-parser-js';

import { User } from '@/user/entity';

export interface IRequestApp extends Request {
  correlationId: string;
  timezone: string;
  timestamp?: string;
  user?: Record<string, any>;
  customLang: string;
  version?: string;
  userAgent?: IResult;
  __user?: User;
  __class: string;
  __function: string;
}
