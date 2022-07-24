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

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  template: string;

  @IsString()
  @IsOptional()
  subject: string;

  @IsNotEmpty()
  @IsArray()
  @IsEmail({ allow_display_name: true }, { each: true })
  to: string[];

  @IsOptional()
  @IsEmail({ allow_display_name: true })
  from: string;

  @IsObject()
  @IsOptional()
  emailTemplatePayload: any;

  @IsString()
  @IsOptional()
  warehouseCode: string;

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

export type EmailHtmlRequestInfo = {
  template: string;
  emailTemplatePayload: any;
  warehouseCode: string;
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
