export enum EmailTemplate {
  SendOrganizationInvite = 'SendOrganizationInvite',
  SendNetworkInvite = 'SendNetworkInvite',
  SendNetworkNewConnectionRequest = 'SendNetworkNewConnectionRequest',
  SendSignUpEmailVerification = 'Email Verification',
  SendGiftSurvey = 'Survey Confirmation',
  SendGiftConfirm = 'SendGiftConfirm',
  SendGiftOptions = 'SendGiftOptions',
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
  description: string;
  imageUrl: string;
  productLink: string;
};

export type GiftOptionSelectMessageData = {
  recipient: {
    firstName: string;
  };
  sender: {
    firstName: string;
  };
  giftOptions: GiftOption[];
};
