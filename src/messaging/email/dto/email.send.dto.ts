import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  GiftOptionSelectMessageData,
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
    | GiftOptionSelectMessageData
    | any; // TODO: add here all the types instead.

  @IsObject()
  @IsOptional()
  identifier: Identifier;
}
