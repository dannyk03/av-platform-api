import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConnectionNames } from '@/database/database.constant';

import { Log } from './entity';
import { LogService } from './service';

@Global()
@Module({
  providers: [LogService],
  exports: [LogService],
  imports: [TypeOrmModule.forFeature([Log], ConnectionNames.Default)],
})
export class LogModule {}
