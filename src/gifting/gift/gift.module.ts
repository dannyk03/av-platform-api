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
import { GiftSelect } from './entity/gift-select.entity';
import { Gift } from './entity/gift.entity';

import {
  GiftIntentService,
  GiftSendConfirmationLinkService,
  GiftSenderService,
  GiftService,
} from './service';
import { GiftRecipientService } from './service/gift-recipient.service';

import { ConnectionNames } from '@/database';
import { EmailService } from '@/messaging/email';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Gift,
        GiftSelect,
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
    GiftService,
    GiftIntentService,
    GiftRecipientService,
    GiftSenderService,
    GiftSendConfirmationLinkService,
  ],
  providers: [
    GiftService,
    GiftIntentService,
    GiftRecipientService,
    GiftSenderService,
    GiftSendConfirmationLinkService,
    EmailService,
  ],
  controllers: [],
})
export class GiftModule {}
