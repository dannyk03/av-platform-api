import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { GiftSend } from './entity';
import { GuestGiftSend } from './entity/gift-send-guest.entity';
// Services
import { EmailService } from '@/messaging/service/email';
import { GiftSendGuestService, GiftSendService } from './service';
//
import { ConnectionNames } from '@/database';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [GiftSend, GuestGiftSend],
      ConnectionNames.Default,
    ),
  ],
  exports: [GiftSendService, GiftSendGuestService],
  providers: [GiftSendService, GiftSendGuestService, EmailService],
  controllers: [],
})
export class GiftModule {}
