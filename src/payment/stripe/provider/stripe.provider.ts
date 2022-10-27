import { Provider } from '@nestjs/common';

import Stripe from 'stripe';

import { StripeOptions } from '../type';

import { STRIPE_TOKEN } from '../constant';

import { getStripeClient } from '../utils';

export function createStripeProvider(options: StripeOptions): Provider<Stripe> {
  return {
    provide: STRIPE_TOKEN,
    useValue: getStripeClient(options),
  };
}
