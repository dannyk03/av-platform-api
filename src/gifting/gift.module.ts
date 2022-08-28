import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessagingModule } from '@/messaging/messaging.module';

import {
  GiftIntent,
  GiftIntentAdditionalData,
  GiftIntentConfirmationLink,
  GiftIntentReadyLink,
  GiftRecipient,
  GiftSender,
} from './entity';
import { GiftSubmit } from './entity/gift-submit.entity';
import { Gift } from './entity/gift.entity';

import {
  GiftIntentConfirmationLinkService,
  GiftIntentReadyLinkService,
  GiftIntentService,
  GiftSenderService,
  GiftService,
  GiftSubmitService,
} from './service';
import { GiftRecipientService } from './service/gift-recipient.service';
import { EmailService } from '@/messaging/email/service';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Gift,
        GiftSubmit,
        GiftIntent,
        GiftSender,
        GiftRecipient,
        GiftIntentReadyLink,
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
    GiftSubmitService,
    GiftRecipientService,
    GiftSenderService,
    GiftIntentReadyLinkService,
    GiftIntentConfirmationLinkService,
  ],
  providers: [
    GiftService,
    GiftIntentService,
    GiftSubmitService,
    GiftRecipientService,
    GiftSenderService,
    GiftIntentReadyLinkService,
    GiftIntentConfirmationLinkService,
    EmailService,
  ],
  controllers: [],
})
export class GiftModule {}
