import { Module } from '@nestjs/common';
import { MessageModule } from 'src/message/message.module';
import { WinstonModule } from 'nest-winston';
import { DebuggerModule } from 'src/debugger/debugger.module';
import { ConfigDynamicModule } from 'src/config/index';
import { AuthModule } from 'src/auth/auth.module';
import { PaginationModule } from 'src/utils/pagination/pagination.module';
import { HelperModule } from 'src/utils/helper/helper.module';
import { MiddlewareModule } from 'src/utils/middleware/middleware.module';
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
