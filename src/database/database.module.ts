import { Module } from '@nestjs/common';

import { TypeOrmConfigService } from './service';

@Module({
  providers: [TypeOrmConfigService],
  exports: [TypeOrmConfigService],
  imports: [],
})
export class DatabaseModule {}
