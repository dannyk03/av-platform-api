import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareModule } from '@/middleware/middleware.module';
import { HelperModule } from '@utils/helper/helper.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DatabaseModule,
  DatabaseService,
  DATABASE_CONNECTION_NAME,
} from '@/database';
import Configs from '@/config';

@Module({
  controllers: [],
  providers: [],
  imports: [
    MiddlewareModule,
    ConfigModule.forRoot({
      load: Configs,
      isGlobal: true,
      cache: true,
      expandVariables: true,
      ignoreEnvFile: false,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      connectionName: DATABASE_CONNECTION_NAME,
      inject: [DatabaseService],
      imports: [DatabaseModule],
      useFactory: (databaseService: DatabaseService) =>
        databaseService.createMongooseOptions(),
    }),
    HelperModule,
    DatabaseModule,
  ],
})
export class CoreModule {}
