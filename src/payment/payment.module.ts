import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { StripeModule } from './stripe/stripe.module';

import { PaymentService } from './service';
import { StripeService } from './stripe/service';

@Module({
  imports: [
    StripeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('stripe.secretKey'),
        apiVersion: '2022-08-01',
      }),
    }),
  ],
  exports: [PaymentService, StripeService],
  providers: [PaymentService, StripeService],
  controllers: [],
})
export class PaymentModule {}
