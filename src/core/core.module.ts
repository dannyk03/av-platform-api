import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from '@/message';
import { DebuggerModule, DebuggerOptionService } from '@/debugger';
import { ConfigDynamicModule } from '@/config';
import { AuthModule } from '@/auth';
import { PaginationModule } from '@/utils/pagination';
import { HelperModule } from '@/utils/helper';
import { MiddlewareModule } from '@/utils/middleware';
import { DatabaseModule, ConnectionNames } from '@/database/';
import { LoggerModule } from '@/logger';
import { RequestModule } from '@/utils/request';
import { ErrorModule } from '@/utils/error';
import { VersionModule } from '@/utils/version';
import { TypeOrmConfigService } from '@/database';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigDynamicModule,
    WinstonModule.forRootAsync({
      inject: [DebuggerOptionService],
      imports: [DebuggerModule],
      useFactory: (loggerService: DebuggerOptionService) =>
        loggerService.createLogger(),
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      name: ConnectionNames.Default,
      // useFactory: (configService: ConfigService) =>
      // configService.get(`database.${ConnectionNames.Default}`),
      // imports: [ConfigModule],
      // inject: [ConfigService],
      // dataSourceFactory: async (options) => {
      //   const dataSource = await new DataSource(options).initialize();
      //   return dataSource;
      // },
    }),
    DatabaseModule,
    HelperModule,
    DebuggerModule,
    MessageModule,
    ErrorModule,
    PaginationModule,
    RequestModule,
    VersionModule,
    MiddlewareModule,
    LoggerModule,
    AuthModule,
  ],
})
export class CoreModule {}
