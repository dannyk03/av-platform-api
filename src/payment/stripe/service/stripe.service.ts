import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Stripe from 'stripe';

@Injectable()
export class StripeService {
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
        amount, // in cents
        currency,
      },
      // { stripeAccount: customerStripeId },
    );

    console.log(`${paymentIntent.client_secret} is the client secret`);

    return paymentIntent.client_secret;
  }

  async getTaxAmount({ taxCode, recipientZipCode, basePrice }) {
    // ask stripe what is the tax for this product
    return 10;
  }
}
