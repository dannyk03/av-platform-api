import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CorsMiddleware } from './cors/cors.middleware';
import {
  HttpDebuggerMiddleware,
  HttpDebuggerResponseMiddleware,
} from './http-debugger/http-debugger.middleware';
import { HelmetMiddleware } from './helmet/helmet.middleware';
import { UserAgentMiddleware } from './user-agent/user-agent.middleware';
import { TimestampMiddleware } from './timestamp/timestamp.middleware';
import { CompressionMiddleware } from './compression/compression.middleware';
import { CorrelationIdMiddleware } from './correlation-id/correlation-id.middleware';
import { CookieParserMiddleware } from './cookie-parser/cookie-parser.middleware';
import { ResponseTimeMiddleware } from './response-time/response-time.middleware';
import { CustomLanguageMiddleware } from './custom-language/custom-language.middleware';
import { TimezoneMiddleware } from './timezone/timezone.middleware';

@Module({})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        CorrelationIdMiddleware,
        TimezoneMiddleware,
        CompressionMiddleware,
        CorsMiddleware,
        HttpDebuggerResponseMiddleware,
        HttpDebuggerMiddleware,
        HelmetMiddleware,
        CookieParserMiddleware,
        CustomLanguageMiddleware,
        UserAgentMiddleware,
        ResponseTimeMiddleware,
        TimestampMiddleware,
      )
      .forRoutes('*');
  }
}
