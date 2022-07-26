import { Escape, NormalizeEmail, Trim } from 'class-sanitizer';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { IsPasswordStrong, IsPhoneNumber } from '@/utils/request/validation';

export class AuthSignUpDto {
  @MaxLength(50)
  @IsEmail()
  @NormalizeEmail(true)
  @Trim()
  @Escape()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  @IsNotEmpty()
  @Trim()
  @Escape()
  @Type(() => String)
  readonly firstName?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  @IsNotEmpty()
  @Trim()
  @Escape()
  @Type(() => String)
  readonly lastName?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(20)
  @IsPhoneNumber()
  @Trim()
  @Escape()
  @Type(() => String)
  readonly phoneNumber?: string;

  @IsNotEmpty()
  @MaxLength(30)
  @IsPasswordStrong()
  @Trim()
  @Type(() => String)
  readonly password!: string;
}
