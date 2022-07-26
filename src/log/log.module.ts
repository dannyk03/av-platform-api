import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LogService } from './service';

import { Log } from './entity';

import { ConnectionNames } from '@/database/database.constant';

@Global()
@Module({
  providers: [LogService],
  exports: [LogService],
  imports: [TypeOrmModule.forFeature([Log], ConnectionNames.Default)],
})
export class LogModule {}
