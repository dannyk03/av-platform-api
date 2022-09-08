import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { EmailService } from './email/service';

import { CustomerIOService } from './customer-io';

@Module({
  imports: [HttpModule],
  exports: [EmailService, CustomerIOService],
  providers: [EmailService, CustomerIOService],
  controllers: [],
})
export class MessagingModule {}
