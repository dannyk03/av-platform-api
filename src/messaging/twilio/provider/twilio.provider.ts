import { Provider } from '@nestjs/common';

import TwilioClient from 'twilio/lib/rest/Twilio';

import { TwilioOptions } from '../type';

import { TWILIO_TOKEN } from '../constant';

import { getTwilioClient } from '../utils';

export function createTwilioProvider(
  options: TwilioOptions,
): Provider<TwilioClient> {
  return {
    provide: TWILIO_TOKEN,
    useValue: getTwilioClient(options),
  };
}
