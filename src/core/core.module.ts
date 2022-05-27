import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Configs from '@/config';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      load: Configs,
      isGlobal: true,
      cache: true,
      expandVariables: true,
      ignoreEnvFile: false,
      envFilePath: ['.env'],
    }),
  ],
})
export class CoreModule {}
