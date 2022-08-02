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
import { GiftOption } from './entity/gift-option.entity';
import { Gift } from './entity/gift.entity';

import {
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
        GiftOption,
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
