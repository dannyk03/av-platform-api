import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  IsMongoId,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { IsPasswordStrong } from '@/utils/request/validation/request.is-password-strong.validation';
import { IsStartWith } from '@/utils/request/validation/request.is-start-with.validation';

export class OrganizationCreateDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(30)
  readonly email: string;

  @IsNotEmpty()
  @IsPasswordStrong()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;
}
