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
import { GiftSubmit } from './entity/gift-submit.entity';
import { Gift } from './entity/gift.entity';

import {
  GiftIntentConfirmationLinkService,
  GiftIntentService,
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
        GiftSubmit,
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
    GiftIntentConfirmationLinkService,
  ],
  providers: [
    GiftService,
    GiftIntentService,
    GiftRecipientService,
    GiftSenderService,
    GiftIntentConfirmationLinkService,
    EmailService,
  ],
  controllers: [],
})
export class GiftModule {}
