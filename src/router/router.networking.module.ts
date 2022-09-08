import { Module } from '@nestjs/common';

import { MessagingModule } from '@/messaging/messaging.module';
import { NetworkingModule } from '@/networking/networking.module';
import { UserModule } from '@/user/user.module';

import { NetworkingCommonController } from '@/networking/controller';

@Module({
  controllers: [NetworkingCommonController],
  providers: [],
  exports: [],
  imports: [NetworkingModule, UserModule, MessagingModule],
})
export class RouterNetworkingModule {}
