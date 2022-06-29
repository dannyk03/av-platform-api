import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { IsPasswordStrong } from '@/utils/request/validation/request.is-password-strong.validation';
import { IsStartWith } from '@/utils/request/validation/request.is-start-with.validation';

export class UserCreateDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  readonly firstName: string;

  @IsString()
  @IsOptional()
  @ValidateIf((e) => e.lastName !== '')
  @MinLength(1)
  @MaxLength(30)
  readonly lastName?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(14)
  @IsStartWith(['972'])
  readonly mobileNumber: string;

  @IsNotEmpty()
  readonly role: string;

  @IsNotEmpty()
  @IsPasswordStrong()
  readonly password: string;
}
