import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  NormalizeEmail,
  NormalizeStringInput,
  Trim,
} from '@/utils/request/transform';
import { IsPasswordStrong } from '@/utils/request/validation';

export class UserCreateDto {
  @NormalizeEmail()
  readonly email: string;

  @MaxLength(30)
  @IsOptional()
  @IsNotEmpty()
  @NormalizeStringInput()
  @Type(() => String)
  readonly firstName?: string;

  @MaxLength(30)
  @IsOptional()
  @IsNotEmpty()
  @NormalizeStringInput()
  @Type(() => String)
  readonly lastName?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(14)
  @IsPhoneNumber()
  @NormalizeStringInput()
  readonly phoneNumber?: string;

  @IsNotEmpty()
  @NormalizeStringInput()
  readonly role: string;

  @IsNotEmpty()
  @IsPasswordStrong()
  @Trim()
  @Type(() => String)
  readonly password: string;
}
