import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Log } from './entity';

import { LogService } from './service';

import { ConnectionNames } from '@/database/constants';

@Global()
@Module({
  providers: [LogService],
  exports: [LogService],
  imports: [TypeOrmModule.forFeature([Log], ConnectionNames.Default)],
})
export class LogModule {}
