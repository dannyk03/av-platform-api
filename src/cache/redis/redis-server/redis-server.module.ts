import { Module } from '@nestjs/common';

import { RedisServerService } from './service';

@Module({
  imports: [],
  exports: [RedisServerService],
  providers: [RedisServerService],
  controllers: [],
})
export class RedisServerModule {}
