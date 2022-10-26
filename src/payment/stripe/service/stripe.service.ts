import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Stripe from 'stripe';

import { InjectStripe } from '../decorator';

@Injectable()
export class StripeService {
  constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly configService: ConfigService,
  ) {}

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
