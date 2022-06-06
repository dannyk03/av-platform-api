import { Module } from '@nestjs/common';
import { MessageModule } from 'src/message/message.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { DebuggerModule } from 'src/debugger/debugger.module';
import Configs from 'src/config/index';
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
import { DataSource } from 'typeorm';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      load: Configs,
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
    }),
    WinstonModule.forRootAsync({
      inject: [DebuggerOptionService],
      imports: [DebuggerModule],
      useFactory: (loggerService: DebuggerOptionService) =>
        loggerService.createLogger(),
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      name: ConnectionNames.Master,
      // useFactory: (configService: ConfigService) =>
      // configService.get(`database.${ConnectionNames.Master}`),
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
