import { Module } from '@nestjs/common';
import { MessageModule } from '@/message/message.module';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { DebuggerModule } from '@/debugger/debugger.module';
import Configs from '@/config/index';
import { AuthModule } from '@/auth/auth.module';
import { PaginationModule } from '@/utils/pagination/pagination.module';
import { HelperModule } from '@/utils/helper/helper.module';
import { MiddlewareModule } from '@/utils/middleware/middleware.module';
import { DebuggerOptionService } from '@/debugger/service/debugger.option.service';
import { DatabaseModule } from '@/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@/database/database.constant';
import { DatabaseService } from '@/database/service/database.service';
import { LoggerModule } from '@/logger/logger.module';
import { RequestModule } from '@/utils/request/request.module';
import { ErrorModule } from '@/utils/error/error.module';
import { SettingModule } from '@/setting/setting.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        MiddlewareModule,
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
        MongooseModule.forRootAsync({
            connectionName: DATABASE_CONNECTION_NAME,
            inject: [DatabaseService],
            imports: [DatabaseModule],
            useFactory: (databaseService: DatabaseService) =>
                databaseService.createMongooseOptions(),
        }),
        LoggerModule,
        ErrorModule,
        RequestModule,
        DatabaseModule,
        MessageModule,
        PaginationModule,
        DebuggerModule,
        HelperModule,
        AuthModule,
        SettingModule,
    ],
})
export class CoreModule {}
