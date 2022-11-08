import { Request } from 'express';
import { IResult } from 'ua-parser-js';

import { User } from '@/user/entity';

interface IRequestAppExt {
  rawBody: Buffer;
}

export interface IRequestApp extends Request, IRequestAppExt {
  correlationId: string;
  timezone: string;
  timestamp: number;
  customLang: string[];
  version: string;
  repoVersion: string;
  userAgent?: IResult;
  user?: Record<string, any>;
  __user?: User;
  __class: string;
  __function: string;
}
