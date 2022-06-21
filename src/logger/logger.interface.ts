import { EnumLoggerAction } from './logger.constant';
export interface ILogger {
  action: EnumLoggerAction;
  description: string;
  apiKey?: string;
  user?: string;
  tags?: string[];
}
