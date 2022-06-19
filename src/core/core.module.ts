import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { MessageModule } from '@/message';
import { DebuggerModule } from '@/debugger';
import { ConfigDynamicModule } from '@/config';
import { AuthModule } from '@/auth';
import { PaginationModule } from '@/utils/pagination';
import { HelperModule } from '@/utils/helper';
import { MiddlewareModule } from '@/utils/middleware';
import { DebuggerOptionService } from 'src/debugger/service/debugger.option.service';
import { DatabaseModule } from 'src/database/database.module';
import { ConnectionNames } from 'src/database/database.constant';
import { LoggerModule } from 'src/logger/logger.module';
import { RequestModule } from 'src/utils/request/request.module';
import { ErrorModule } from 'src/utils/error/error.module';
import { VersionModule } from 'src/utils/version/version.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@/database/service';

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
