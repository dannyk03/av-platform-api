import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import {
  Gift,
  GiftRecipient,
  GiftSendConfirmationLink,
  GiftSender,
} from './entity';

// Services
import { EmailService } from '$/messaging/email';
import {
  GiftSendConfirmationLinkService,
  GiftSenderService,
  GiftService,
} from './service';
//
import { ConnectionNames } from '$/database';
import { MessagingModule } from '$/messaging/messaging.module';
import { GiftRecipientService } from './service/gift-recipient.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Gift, GiftRecipient, GiftSender, GiftSendConfirmationLink],
      ConnectionNames.Default,
    ),
    MessagingModule,
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
