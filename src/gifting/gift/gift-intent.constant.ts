export const GIFT_INTENT_DEFAULT_PAGE = 1;
export const GIFT_INTENT_DEFAULT_PER_PAGE = 10;
export const GIFT_INTENT_DEFAULT_SORT = 'createdAt@asc';
export const GIFT_INTENT_DEFAULT_AVAILABLE_SORT = [
  'createdAt',
  // 'senderEmail',
  // 'recipientEmail',
];
export const GIFT_INTENT_DEFAULT_AVAILABLE_SEARCH = ['email'];

export const GiftIntentOrderByNestingAliasMap = {
  createdAt: 'giftIntent.createdAt',
  // senderEmail: 'giftIntent.sender.user.email',
  // recipientEmail: 'giftIntent.recipient.user.email',
};
