import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { CorsMiddleware } from './cors/cors.middleware';
import {
  HtmlBodyParserMiddleware,
  JsonBodyParserMiddleware,
  RawBodyParserMiddleware,
  TextBodyParserMiddleware,
  UrlencodedBodyParserMiddleware,
} from './body-parser/body-parser.middleware';
import {
  HttpDebuggerMiddleware,
  HttpDebuggerResponseMiddleware,
} from './http-debugger/http-debugger.middleware';
import { HelmetMiddleware } from './helmet/helmet.middleware';
import { RateLimitMiddleware } from './rate-limit/rate-limit.middleware';
import { UserAgentMiddleware } from './user-agent/user-agent.middleware';
import { TimestampMiddleware } from './timestamp/timestamp.middleware';
import { CompressionMiddleware } from './compression/compression.middleware';

@Module({})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        JsonBodyParserMiddleware,
        RawBodyParserMiddleware,
        HtmlBodyParserMiddleware,
        TextBodyParserMiddleware,
        UrlencodedBodyParserMiddleware,
        CompressionMiddleware,
        CorsMiddleware,
        HttpDebuggerResponseMiddleware,
        HttpDebuggerMiddleware,
        HelmetMiddleware,
        RateLimitMiddleware,
        UserAgentMiddleware,
      )
      .forRoutes('*');

    consumer
      .apply(TimestampMiddleware)
      .exclude(
        {
          path: 'api/v:version*/callback/(.*)',

          method: RequestMethod.ALL,
        },
        {
          path: 'api/callback/(.*)',
          method: RequestMethod.ALL,
        },
      )
      .forRoutes('*');
  }
}
