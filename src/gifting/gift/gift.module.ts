import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import {
  Gift,
  GiftRecipient,
  GiftSender,
  GiftSendConfirmationLink,
} from './entity';

// Services
import { EmailService } from '@/messaging/email';
import {
  GiftSenderService,
  GiftSendConfirmationLinkService,
  GiftService,
} from './service';
//
import { ConnectionNames } from '@/database';
import { GiftRecipientService } from './service/gift-recipient.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Gift, GiftRecipient, GiftSender, GiftSendConfirmationLink],
      ConnectionNames.Default,
    ),
  ],
  exports: [
    GiftService,
    GiftRecipientService,
    GiftSenderService,
    GiftSendConfirmationLinkService,
  ],
  providers: [
    GiftService,
    GiftRecipientService,
    GiftSenderService,
    GiftSendConfirmationLinkService,
    EmailService,
  ],
  controllers: [],
})
export class GiftModule {}
