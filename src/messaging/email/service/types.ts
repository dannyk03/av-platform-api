import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsObject,
  IsArray,
  IsEmail,
} from 'class-validator';

export interface EmailService {
  sendEmail(emailSendData: SendEmailDto): Promise<EmailInstance>;
}

export enum EmailTemplate {
  SendOrganizationInvite = 'SendOrganizationInvite',
  SendSignUpEmailVerification = 'SendSignUpEmailVerification',
  SendGiftSurvey = 'SendGiftSurvey',
  SendGiftConfirm = 'SendGiftConfirm',
}

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  template: string; // TODO: replace with EmailTemplate enum

  @IsNotEmpty()
  @IsArray()
  @IsEmail({ allow_display_name: true }, { each: true })
  to: string[];

  @IsObject()
  @IsOptional()
  emailTemplatePayload: any;

  @IsObject()
  @IsOptional()
  identifier: Identifier;
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

export enum EmailStatus {
  success = 'success',
  failure = 'failure',
}
