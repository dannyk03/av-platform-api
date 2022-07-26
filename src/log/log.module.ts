import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Services
import { LogService } from './service';
//
import { ConnectionNames } from '$/database/database.constant';
import { Log } from './entity';

@Global()
@Module({
  providers: [LogService],
  exports: [LogService],
  imports: [TypeOrmModule.forFeature([Log], ConnectionNames.Default)],
})
export class LogModule {}
