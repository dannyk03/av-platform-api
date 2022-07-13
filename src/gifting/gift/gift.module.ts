import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { GiftSend } from './entity';
// Services
import { GiftSendService } from './service/gift-send.service';
import { EmailService } from '@/messaging/service/email/email.service';
//
import { ConnectionNames } from '@/database';

@Module({
  imports: [TypeOrmModule.forFeature([GiftSend], ConnectionNames.Default)],
  exports: [GiftSendService],
  providers: [GiftSendService, EmailService],
  controllers: [],
})
export class GiftModule {}
