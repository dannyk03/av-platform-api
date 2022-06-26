import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
// Modules
import { ConfigDynamicModule } from '@/config';
import { AuthModule } from '@/auth/auth.module';
import { MessageModule } from '@/message/message.module';
import { DebuggerModule } from '@/debugger/debugger.module';
import { DatabaseModule } from '@/database/database.module';
import { MiddlewareModule } from '@/utils/middleware/middleware.module';
import { LogModule } from '@/log/log.module';
import { ErrorModule } from '@/utils/error/error.module';
import { PaginationModule } from '@/utils/pagination/pagination.module';
import { HelperModule } from '@/utils/helper/helper.module';
import { RequestModule } from '@/utils/request/request.module';
import { VersionModule } from '@/utils/version/version.module';
// Services
import { DebuggerOptionService } from '@/debugger/service/debugger.option.service';
import { TypeOrmConfigService } from '@/database/service/typeorm-config.service';
//
import { ConnectionNames } from '@/database/';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigDynamicModule,
    WinstonModule.forRootAsync({
      inject: [DebuggerOptionService],
      imports: [DebuggerModule],
      useFactory: (debuggerOptionService: DebuggerOptionService) =>
        debuggerOptionService.createLogger(),
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
    LogModule,
    AuthModule,
  ],
})
export class CoreModule {}
