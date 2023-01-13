import { Module } from '@nestjs/common';

import { GroupModule } from '@/group/group.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { NetworkingModule } from '@/networking/networking.module';
import { UserModule } from '@/user/user.module';

import { GroupQuestionAnswerController } from '@/group/controller';

@Module({
  controllers: [GroupQuestionAnswerController],
  providers: [],
  exports: [],
  imports: [GroupModule, UserModule, NetworkingModule, MessagingModule],
})
export class RouterGroupQuestionAnswerModule {}
