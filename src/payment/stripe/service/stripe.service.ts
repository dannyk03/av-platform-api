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

  async createPaymentIntent(
    params: Stripe.PaymentIntentCreateParams,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return await this.stripeClient.paymentIntents.create(params);
  }

  async getTaxAmount({ taxCode, recipientZipCode, basePrice }) {
    // ask stripe what is the tax for this product
    return 10;
  }
}
