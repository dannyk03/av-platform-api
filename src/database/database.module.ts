import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './service/typeorm-config.service';

@Module({
  providers: [TypeOrmConfigService],
  exports: [TypeOrmConfigService],
  imports: [],
})
export class DatabaseModule {}
