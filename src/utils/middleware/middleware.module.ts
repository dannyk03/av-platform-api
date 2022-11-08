import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CompressionMiddleware } from './compression/compression.middleware';
import { CookieParserMiddleware } from './cookie-parser/cookie-parser.middleware';
import { CorrelationIdMiddleware } from './correlation-id/correlation-id.middleware';
import { CorsMiddleware } from './cors/cors.middleware';
import { HelmetMiddleware } from './helmet/helmet.middleware';
import {
  HttpDebuggerMiddleware,
  HttpDebuggerResponseMiddleware,
  HttpDebuggerWriteIntoConsoleMiddleware,
  HttpDebuggerWriteIntoFileMiddleware,
} from './http-debugger/http-debugger.middleware';
import { ResponseTimeMiddleware } from './response-time/response-time.middleware';
import { TimestampMiddleware } from './timestamp/timestamp.middleware';
import { TimezoneMiddleware } from './timezone/timezone.middleware';
import { UserAgentMiddleware } from './user-agent/user-agent.middleware';
import { ValidateCustomLanguageMiddleware } from './validate-custom-language/validate-custom-language.middleware';
import { VersionMiddleware } from './version/version.middleware';

@Module({})
export class MiddlewareModule implements NestModule {
  readonly isProduction: boolean;
  constructor(private readonly configService: ConfigService) {
    this.isProduction = this.configService.get<boolean>('app.isProduction');
  }
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        CorrelationIdMiddleware,
        TimezoneMiddleware,
        CompressionMiddleware,
        CorsMiddleware,
        HelmetMiddleware,
        CookieParserMiddleware,
        ValidateCustomLanguageMiddleware,
        UserAgentMiddleware,
        ResponseTimeMiddleware,
        TimestampMiddleware,
        VersionMiddleware,
        HttpDebuggerResponseMiddleware,
        HttpDebuggerMiddleware,
        HttpDebuggerWriteIntoConsoleMiddleware,
        HttpDebuggerWriteIntoFileMiddleware,
      )
      .forRoutes('*');
  }
}
