import { Module } from '@nestjs/common';
// Services
import { TypeOrmConfigService } from './service';
//
@Module({
  providers: [TypeOrmConfigService],
  exports: [TypeOrmConfigService],
  imports: [],
})
export class DatabaseModule {}
