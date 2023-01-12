import { Module } from '@nestjs/common';

import { GroupModule } from '@/group/group.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { NetworkingModule } from '@/networking/networking.module';
import { UserModule } from '@/user/user.module';

import { GroupQuestionController } from '@/group/controller';

@Module({
  controllers: [GroupQuestionController],
  providers: [],
  exports: [],
  imports: [GroupModule, UserModule, NetworkingModule, MessagingModule],
})
export class RouterGroupQuestionModule {}
