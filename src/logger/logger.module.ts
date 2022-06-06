import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionNames } from 'src/database/database.constant';
import { LoggerEntity } from './entity/logger.entity';
import { LoggerService } from './service/logger.service';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
  imports: [TypeOrmModule.forFeature([LoggerEntity], ConnectionNames.Default)],
})
export class LoggerModule {}
