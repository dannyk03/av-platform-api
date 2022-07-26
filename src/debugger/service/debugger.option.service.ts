import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import winston, { LoggerOptions } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { DEBUGGER_NAME } from '../debugger.constant';

@Injectable()
export class DebuggerOptionService {
  private readonly isProduction: boolean;
  private readonly debug: boolean;
  private readonly logger: boolean;
  private readonly maxSize: string;
  private readonly maxFiles: string;

  constructor(private configService: ConfigService) {
    this.isProduction = this.configService.get<boolean>('app.isProduction');
    this.debug = this.configService.get<boolean>('app.debug');
    this.logger = this.configService.get<boolean>('app.debugger.system.active');
    this.maxSize = this.configService.get<string>(
      'app.debugger.system.maxSize',
    );
    this.maxFiles = this.configService.get<string>(
      'app.debugger.system.maxFiles',
    );
  }

  createLogger(): LoggerOptions {
    const transports = [];

    transports.push(
      new DailyRotateFile({
        filename: `%DATE%.log`,
        dirname: `logs/${DEBUGGER_NAME}/error`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: this.maxSize,
        maxFiles: this.maxFiles,
        utc: this.isProduction,
        level: 'error',
      }),
    );
    transports.push(
      new DailyRotateFile({
        filename: `%DATE%.log`,
        dirname: `logs/${DEBUGGER_NAME}/default`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: this.maxSize,
        maxFiles: this.maxFiles,
        utc: this.isProduction,
        level: 'info',
      }),
    );
    transports.push(
      new DailyRotateFile({
        filename: `%DATE%.log`,
        dirname: `logs/${DEBUGGER_NAME}/debug`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: this.maxSize,
        maxFiles: this.maxFiles,
        utc: this.isProduction,
        level: 'debug',
      }),
    );

    if ((this.debug || this.logger) && !this.isProduction) {
      transports.push(new winston.transports.Console());
    }

    const loggerOptions: LoggerOptions = {
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
      transports,
    };
    return loggerOptions;
  }
}
