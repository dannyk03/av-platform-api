import { Provider } from '@nestjs/common';

import Stripe from 'stripe';

import { StripeOptions } from '../type';

import { stripeToken } from '../constant';

import { getStripeClient } from '../utils';

export function createStripeProvider(options: StripeOptions): Provider<Stripe> {
  return {
    provide: stripeToken,
    useValue: getStripeClient(options),
  };
}
