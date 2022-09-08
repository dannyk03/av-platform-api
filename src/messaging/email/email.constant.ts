export enum EmailTemplate {
  // ================= MVP =================
  // - gift option select
  SendGiftSelection = 'Gift Selection',
  // - verify email
  SendSignUpEmailVerification = 'Email Verification',
  // - gift is on the way (sender)
  SendSenderGiftIsOnItsWay = "Gift is on it's Way - Sender",
  // - reset password
  SendResetPassword = 'Reset Password',

  // - gift delivered (sender)
  SendSenderGiftDelivered = 'Gift Delivered - Sender',
  // - gift delivered (recipient)
  SendRecipientGiftDelivered = 'Gift Delivered - Recipient',
  // - connection request accepted
  SendConnectionRequestAccepted = 'Send Connection Request Accepted',
  // - connection request - user in the system
  SendConnectionRequestExistingUser = 'Connection Request - Existing User',
  // - connection request - user isn't in the system
  SendConnectionRequestNewUser = 'Connection Request - New User',
  // - invatation for the survey
  SendSurveyInvatation = 'Survey Invatation',
  //- survey completed
  SendSurveyCompleted = 'Survey Completed',
  // ================= MVP =================

  SendOrganizationInvite = 'SendOrganizationInvite',
  SendGiftConfirm = 'SendGiftConfirm',
  SendGiftShipped = 'SendGiftShipped', // TODO: verify the context
  SendNetworkInvite = 'SendNetworkInvite', // TODO: verify the context
  SendNetworkNewConnectionRequest = 'SendNetworkNewConnectionRequest', // TODO: verify the context
  SendGiftSurvey = 'Survey Confirmation', // TODO: verify the context
  SendSenderGiftShipped = 'Gift Shipped - Sender', // TODO: verify the context
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

export type GiftDetails = {
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
  giftDetails: GiftDetails;
  shippingDetails: GiftShippingDetails;
  sendAnotherGiftUrl: string;
};

export type ResetPasswordMessageData = {
  user: {
    firstName: string;
  };
  resetPasswordLink: string;
};
