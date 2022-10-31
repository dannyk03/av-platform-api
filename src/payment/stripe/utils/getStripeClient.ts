import { name, repository, version } from 'package.json';
import Stripe from 'stripe';

import { StripeOptions } from '../type';

export function getStripeClient({
  apiKey,
  appInfo = {
    url: repository,
    name,
    version,
  },
  ...options
}: StripeOptions): Stripe {
  const stripeClient = new Stripe(apiKey, {
    appInfo,
    ...options,
  });

  return stripeClient;
}
