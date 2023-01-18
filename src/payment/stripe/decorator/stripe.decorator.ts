import { STRIPE_TOKEN } from '../constant';

import { InjectThirdPartyProviderByToken } from '@/utils/third-party-provider';

export function InjectStripeClient() {
  return InjectThirdPartyProviderByToken(STRIPE_TOKEN);
}
