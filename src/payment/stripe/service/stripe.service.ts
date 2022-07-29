import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Stripe from 'stripe';

@Injectable()
export class CustomerIOService {
  private readonly client: Stripe;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.client = new Stripe(
      this.configService.get<string>('stripe.secretKey'),
      {
        apiVersion: '2020-08-27',
      },
    );
  }

  async createPaymentIntent({ amount, currency, customerID }) {
    const customerStripeId = customerID; // get the customer stripe id

    const paymentIntent = await this.client.paymentIntents.create(
      {
        amount,
        currency,
      },
      { stripeAccount: customerStripeId },
    );

    console.log(`${paymentIntent} will include the client secret`);
  }
}
