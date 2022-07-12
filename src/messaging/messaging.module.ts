import { Module } from '@nestjs/common';
import { EmailService } from './service/email/email.service';

@Module({
  imports: [],
  exports: [EmailService],
  providers: [EmailService],
  controllers: [],
})
export class MessagingModule {}
