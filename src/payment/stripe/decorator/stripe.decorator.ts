import { Inject } from '@nestjs/common';

import { stripeToken } from '../constant';

export function InjectStripe() {
  return Inject(stripeToken);
}
