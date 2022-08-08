import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessagingModule } from '@/messaging/messaging.module';

import {
  GiftIntent,
  GiftIntentAdditionalData,
  GiftIntentConfirmationLink,
  GiftRecipient,
  GiftSender,
} from './entity';
import { GiftOrder } from './entity/gift-order.entity';
import { Gift } from './entity/gift.entity';

import {
  GiftIntentService,
  GiftSendConfirmationLinkService,
  GiftSenderService,
} from './service';
import { GiftRecipientService } from './service/gift-recipient.service';

import { ConnectionNames } from '@/database';
import { EmailService } from '@/messaging/email';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Gift,
        GiftOrder,
        GiftIntent,
        GiftSender,
        GiftRecipient,
        GiftIntentAdditionalData,
        GiftIntentConfirmationLink,
      ],
      ConnectionNames.Default,
    ),
    MessagingModule,
  ],
  exports: [
    GiftIntentService,
    GiftRecipientService,
    GiftSenderService,
    GiftSendConfirmationLinkService,
  ],
  providers: [
    GiftIntentService,
    GiftRecipientService,
    GiftSenderService,
    GiftSendConfirmationLinkService,
    EmailService,
  ],
  controllers: [],
})
export class GiftModule {}
