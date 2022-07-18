import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { Gift, GiftRecipient, GiftSender } from './entity';

// Services
import { EmailService } from '@/messaging/service/email';
import { GiftSenderService, GiftService } from './service';
//
import { ConnectionNames } from '@/database';
import { GiftRecipientService } from './service/gift-recipient.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Gift, GiftRecipient, GiftSender],
      ConnectionNames.Default,
    ),
  ],
  exports: [GiftService, GiftRecipientService, GiftSenderService],
  providers: [
    GiftService,
    GiftRecipientService,
    GiftSenderService,
    EmailService,
  ],
  controllers: [],
})
export class GiftModule {}
