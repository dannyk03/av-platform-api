import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Identifier } from '../email.constant';

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
  emailTemplatePayload: any;

  @IsObject()
  @IsOptional()
  identifier: Identifier;
}