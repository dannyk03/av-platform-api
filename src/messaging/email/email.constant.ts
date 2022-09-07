export enum EmailTemplate {
  SendOrganizationInvite = 'SendOrganizationInvite',
  SendNetworkInvite = 'SendNetworkInvite',
  SendNetworkNewConnectionRequest = 'SendNetworkNewConnectionRequest',
  SendSignUpEmailVerification = 'Email Verification',
  SendGiftSurvey = 'Survey Confirmation',
  SendGiftConfirm = 'SendGiftConfirm',
  SendGiftSelection = 'Gift Selection',
  SendGiftShipped = 'SendGiftShipped',
  SendRecipientGiftShipped = 'Gift Shipped - Recipient',
  SendSenderGiftShipped = 'Gift Shipped - Sender',
}

export enum EmailStatus {
  success = 'success',
  failure = 'failure',
}

// Email instance created by the email provider
export type EmailInstance = {
  id: string;
  status: EmailStatus;
  response: string;
};

export type EmailSendResult = {
  messageId: string;
  response: string;
  accepted: Array<string>;
};

export type EmailHtmlResponse = string;

export type CustomerIOTransactionalResponse = {
  messages: Array<CustomerIOTransactionalMessage>;
};

export type CustomerIOTransactionalMessage = {
  id: string;
  name: string;
};

export type Identifier = {
  id: string;
};

export type GiftSurveyMessageData = {
  sender: {
    organization: string;
    firstName: string;
  };
  recipient: {
    firstName: string;
  };
};

export type SignUpEmailVerificationMessageData = {
  user: {
    firstName: string;
  };
  activationCode: string;
};

export type GiftOption = {
  productName: string;
  brand: string;
  description: string;
  imageUrl: string;
};

export type GiftOptionSelectMessageData = {
  recipient: {
    firstName: string;
  };
  sender: {
    firstName: string;
  };
  giftOptions: GiftOption[];
  giftSelectUrl: string;
};

export type ShippedGiftDetails = {
  productName: string;
  imageUrl: string;
  formattedPrice: string;
  personalNote: string;
};

export type GiftShippingDetails = {
  shippingAddress: string;
  ETA: string;
};

export type GiftShippedMessageData = {
  recipient: {
    firstName: string;
  };
  sender: {
    firstName: string;
  };
  shippedGiftDetails: ShippedGiftDetails;
  shippingDetails: GiftShippingDetails;
  sendAnotherGiftUrl: string;
};
