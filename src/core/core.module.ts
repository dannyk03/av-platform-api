import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareModule } from '@/middleware/middleware.module';
import { HelperModule } from '@utils/helper/helper.module';
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
    HelperModule,
  ],
})
export class CoreModule {}
