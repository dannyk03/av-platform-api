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
  // - connection request - user isn't in the system
  SendConnectionRequestNewUser = 'Connection Request - New User',
  // - connection request - user in the system
  SendConnectionRequestExistingUser = 'Connection Request - Existing User',
  //- survey completed
  SendSurveyCompleted = 'Survey Completed', // sent to all pending inviters (excluding the admin from the MVP)
  // ================= MVP =================
  // - invitation for the survey
  SendSurveyInvitation = 'Survey Invitation', // start the chain, without connecitons, sent from admin

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
  giftIntentId: string;
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

export type GiftStatusUpdateMessageData = {
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

export type GiftDeliveredToRecipientMessageData = {
  recipient: {
    firstName: string;
  };
  sender: {
    firstName: string;
  };
  shippingDetails: GiftShippingDetails;
  actionUrl: string;
};

export type ResetPasswordMessageData = {
  user: {
    firstName: string;
  };
  resetPasswordLink: string;
};

export type ConnectionRequestMessageData = {
  requestingUser: {
    firstName: string;
  };
  receivingUser: {
    firstName: string;
  };
  connectionViewLink: string;
  personalNote: string;
};

export type ConnectionRequestNewUserMessageData = {
  requestingUser: {
    firstName: string;
  };
  personalNote: string;
  connectionId: string;
};

export type ConnectionRequestExistingUserMessageData = {
  requestingUser: {
    firstName: string;
  };
  receivingUser: {
    firstName: string;
  };
  connectionApproveLink: string;
  connectionRejectLink: string;
  connectionId: string;
};

export type SurveyInvitationMessageData = {
  inviteeUser: {
    firstName: string;
  };
  inviterUser: {
    firstName: string;
  };
  personalNote: string;
  surveyLink: string;
};

export type SurveyCompletedMessageData = {
  inviteeUser: {
    firstName: string;
    id: string;
  };
  inviterUser: {
    firstName: string;
  };
  socialConnectionRequestId: string; // TODO: delete
};
