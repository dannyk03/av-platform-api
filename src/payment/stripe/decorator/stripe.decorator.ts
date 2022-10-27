import { Inject } from '@nestjs/common';

import { STRIPE_TOKEN } from '../constant';

export function InjectStripe() {
  return Inject(STRIPE_TOKEN);
}
