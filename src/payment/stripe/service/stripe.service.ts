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
        apiVersion: '2022-08-01',
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

  async createOrder(giftIntentId) {
    // TODO: move to payment service
    // load the GiftIntent object / it will be given as input

    // build the Order and its OrderItems records
    // calculate shipping, taxes

    // save in the db

    // return the Order and its OrderItems records as a result.
    return {
      id: '',
      totalPrice: 80,
      totalTax: 13,
      totalShipping: 13,
      orderItems: [
        {
          tax: 12,
          shipping: 12,
          totalPrice: 40,
          basePrice: 16,
        },
        {
          tax: 1,
          shipping: 1,
          totalPrice: 40,
          basePrice: 38,
        },
      ],
    };
  }
}
