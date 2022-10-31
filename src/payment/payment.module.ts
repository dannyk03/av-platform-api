import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StripeModule } from './stripe/stripe.module';

import { StripePayment } from './stripe/entity';

import { PaymentService } from './service';
import { StripeService } from './stripe/service';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    StripeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('stripe.secretKey'),
        apiVersion: '2022-08-01',
      }),
    }),
    TypeOrmModule.forFeature([StripePayment], ConnectionNames.Default),
  ],
  exports: [PaymentService, StripeService],
  providers: [PaymentService, StripeService],
  controllers: [],
})
export class PaymentModule {}
