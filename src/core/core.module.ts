import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
// Modules
import { ConfigDynamicModule } from '@/config';
import { AuthModule } from '@/auth/auth.module';
import { ResponseMessageModule } from '@/response-message/response-message.module';
import { DebuggerModule } from '@/debugger/debugger.module';
import { DatabaseModule } from '@/database/database.module';
import { MiddlewareModule } from '@/utils/middleware/middleware.module';
import { LogModule } from '@/log/log.module';
import { ErrorModule } from '@/utils/error/error.module';
import { PaginationModule } from '@/utils/pagination/pagination.module';
import { HelperModule } from '@/utils/helper/helper.module';
import { RequestModule } from '@/utils/request/request.module';
import { VersionModule } from '@/utils/version/version.module';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { ResponseModule } from '@/utils/response/response.module';
// Services
import { DebuggerOptionService } from '@/debugger/service';
import { TypeOrmConfigService } from '@/database/service';
//
import { ConnectionNames } from '@/database/';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  imports: [
    ConfigDynamicModule,
    CloudinaryModule,
    WinstonModule.forRootAsync({
      imports: [DebuggerModule],
      inject: [DebuggerOptionService],
      useFactory: (debuggerOptionService: DebuggerOptionService) =>
        debuggerOptionService.createLogger(),
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      name: ConnectionNames.Default,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('middleware.rateLimit.resetTime'),
        limit: configService.get<number>(
          'middleware.rateLimit.maxRequestPerIp',
        ),
        // TODO The built in storage is an in memory cache that keeps track of the requests made until they have passed the TTL
        // storage: Redis ThrottlerStorage
      }),
    }),
    DatabaseModule,
    HelperModule,
    DebuggerModule,
    ResponseMessageModule,
    ErrorModule,
    PaginationModule,
    RequestModule,
    VersionModule,
    MiddlewareModule,
    LogModule,
    AuthModule,
    ResponseModule,
  ],
})
export class CoreModule {}
