import { Inject } from '@nestjs/common';

import { TWILIO_TOKEN } from '../constant';

export function InjectTwilio() {
  return Inject(TWILIO_TOKEN);
}
