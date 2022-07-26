import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CompressionMiddleware } from './compression/compression.middleware';
import { CookieParserMiddleware } from './cookie-parser/cookie-parser.middleware';
import { CorrelationIdMiddleware } from './correlation-id/correlation-id.middleware';
import { CorsMiddleware } from './cors/cors.middleware';
import { CustomLanguageMiddleware } from './custom-language/custom-language.middleware';
import { HelmetMiddleware } from './helmet/helmet.middleware';
import {
  HttpDebuggerMiddleware,
  HttpDebuggerResponseMiddleware,
} from './http-debugger/http-debugger.middleware';
import { ResponseTimeMiddleware } from './response-time/response-time.middleware';
import { TimestampMiddleware } from './timestamp/timestamp.middleware';
import { TimezoneMiddleware } from './timezone/timezone.middleware';
import { UserAgentMiddleware } from './user-agent/user-agent.middleware';

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
