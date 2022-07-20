import { Request } from 'express';
import { IResult } from 'ua-parser-js';

export interface IRequestApp extends Request {
  userAgent?: IResult;
  timezone: string;
  timestamp: string;
  customLang: string;
  user?: Record<string, any>;
  version?: string;
  correlationId: string;
  __class: string;
  __function: string;
}
