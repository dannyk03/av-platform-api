import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { StripeService } from './stripe';

@Module({
  imports: [HttpModule],
  exports: [/*EmailService, */ StripeService],
  providers: [/*EmailService, */ StripeService],
  controllers: [],
})
export class PaymentModule {}
