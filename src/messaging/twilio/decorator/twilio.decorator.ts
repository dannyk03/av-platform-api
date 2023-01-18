import { TWILIO_TOKEN } from '../constant';

import { InjectThirdPartyProviderByToken } from '@/utils/third-party-provider';

export function InjectTwilioClient() {
  return InjectThirdPartyProviderByToken(TWILIO_TOKEN);
}
