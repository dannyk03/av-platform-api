import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
} from 'class-validator';
import {
  Identifier,
  GiftSurveyMessageData,
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
    | SignUpEmailVerificationMessageData;

  @IsObject()
  @IsOptional()
  identifier: Identifier;
}
