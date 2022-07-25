import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CustomerIOService } from './customer-io';
import { EmailService } from './email';

@Module({
  imports: [HttpModule],
  exports: [EmailService, CustomerIOService],
  providers: [EmailService, CustomerIOService],
  controllers: [],
})
export class MessagingModule {}
