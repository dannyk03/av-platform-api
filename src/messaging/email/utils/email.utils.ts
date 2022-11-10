import { GiftIntent } from '@/gifting/entity';

export function getTheParticipatingParties({ recipient, sender }: GiftIntent) {
  return {
    recipient: {
      firstName: recipient.user?.profile?.firstName,
    },
    sender: {
      firstName: sender.user?.profile?.firstName,
    },
  };
}

export function getRecipientShippingDetails({ recipient }: GiftIntent) {
  return {
    addressLine1: recipient?.user?.profile?.shipping?.addressLine1,
    addressLine2: recipient?.user?.profile?.shipping?.addressLine2,
    city: recipient?.user?.profile?.shipping?.city,
    country: recipient?.user?.profile?.shipping?.country,
    state: recipient?.user?.profile?.shipping?.state,
    zipCode: recipient?.user?.profile?.shipping?.zipCode,
  };
}
