import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Stripe from 'stripe';

import { GiftIntent } from '@/gifting/entity';

import { InjectStripe } from '../decorator';

@Injectable()
export class StripeService {
  constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly configService: ConfigService,
  ) {}

  async createPaymentIntent({ giftIntent }: { giftIntent: GiftIntent }) {
    console.log(giftIntent);
  }

  async getTaxAmount({ taxCode, recipientZipCode, basePrice }) {
    // ask stripe what is the tax for this product
    return 10;
  }
}
