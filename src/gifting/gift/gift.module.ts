import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessagingModule } from '@/messaging/messaging.module';

import {
  GiftSendConfirmationLinkService,
  GiftSenderService,
  GiftService,
} from './service';
import { GiftRecipientService } from './service/gift-recipient.service';

import {
  Gift,
  GiftRecipient,
  GiftSendConfirmationLink,
  GiftSender,
} from './entity';

import { ConnectionNames } from '@/database';
import { EmailService } from '@/messaging/email';

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
