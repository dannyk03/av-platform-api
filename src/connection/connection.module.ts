import { Module } from '@nestjs/common';

import { GroupModule } from '@/group/group.module';
import { NetworkingModule } from '@/networking/networking.module';

import { ConnectionService } from './service';

@Module({
  imports: [GroupModule, NetworkingModule],
  exports: [ConnectionService],
  providers: [ConnectionService],
  controllers: [],
})
export class ConnectionModule {}
