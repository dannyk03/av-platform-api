import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  GiftSurveyMessageData,
  Identifier,
  SignUpEmailVerificationMessageData,
} from '../email.constant';

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  template: string; // TODO: replace with EmailTemplate enum

  @IsNotEmpty()
  @IsArray()
  @IsEmail(undefined, { each: true })
  to: string[];

  @IsObject()
  @IsOptional()
  emailTemplatePayload:
    | GiftSurveyMessageData
    | SignUpEmailVerificationMessageData
    | any;

  @IsObject()
  @IsOptional()
  identifier: Identifier;
}
