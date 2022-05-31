import { LoggerAction } from './logger.constant';
export interface ILogger {
    action: LoggerAction;
    description: string;
    apiKey?: string;
    user?: string;
    tags?: string[];
}
