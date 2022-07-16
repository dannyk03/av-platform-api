import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { GiftSend } from './entity';
// Services
import { EmailService } from '@/messaging/service/email';
import { GiftSendService } from './service';
//
import { ConnectionNames } from '@/database';

@Module({
  imports: [TypeOrmModule.forFeature([GiftSend], ConnectionNames.Default)],
  exports: [GiftSendService],
  providers: [GiftSendService, EmailService],
  controllers: [],
})
export class GiftModule {}
