export enum EmailTemplate {
  SendOrganizationInvite = 'SendOrganizationInvite',
  SendSignUpEmailVerification = 'SendSignUpEmailVerification',
  SendGiftSurvey = 'SendGiftSurvey',
  SendGiftConfirm = 'SendGiftConfirm',
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
