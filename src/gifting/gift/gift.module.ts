import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import {
  Gift,
  GiftRecipient,
  GiftSender,
  GiftSendVerificationLink,
} from './entity';

// Services
import { EmailService } from '@/messaging/service/email';
import {
  GiftSenderService,
  GiftSendVerificationLinkService,
  GiftService,
} from './service';
//
import { ConnectionNames } from '@/database';
import { GiftRecipientService } from './service/gift-recipient.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Gift, GiftRecipient, GiftSender, GiftSendVerificationLink],
      ConnectionNames.Default,
    ),
  ],
  exports: [
    GiftService,
    GiftRecipientService,
    GiftSenderService,
    GiftSendVerificationLinkService,
  ],
  providers: [
    GiftService,
    GiftRecipientService,
    GiftSenderService,
    GiftSendVerificationLinkService,
    EmailService,
  ],
  controllers: [],
})
export class GiftModule {}
