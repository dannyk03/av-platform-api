import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import winston, { LoggerOptions } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { IDebuggerOptionService } from '../types';

import { DEBUGGER_NAME } from '../constant';

@Injectable()
export class DebuggerOptionService implements IDebuggerOptionService {
  private readonly writeIntoFile: boolean = this.configService.get<boolean>(
    'debugger.system.writeIntoFile',
  );
  private readonly writeIntoConsole: boolean = this.configService.get<boolean>(
    'debugger.system.writeIntoConsole',
  );
  private readonly maxSize: string = this.configService.get<string>(
    'debugger.system.maxSize',
  );
  private readonly maxFiles: string = this.configService.get<string>(
    'debugger.system.maxFiles',
  );

  constructor(private configService: ConfigService) {}

  createLogger(): LoggerOptions {
    const transports = [];

    if (this.writeIntoFile) {
      transports.push(
        new DailyRotateFile({
          filename: `%DATE%.log`,
          dirname: `logs/${DEBUGGER_NAME}/error`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: this.maxSize,
          maxFiles: this.maxFiles,
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
          level: 'debug',
        }),
      );
    }

    if (this.writeIntoConsole) {
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
