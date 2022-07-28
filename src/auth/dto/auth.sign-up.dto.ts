import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

import {
  NormalizeEmail,
  NormalizeStringInput,
  Trim,
} from '@/utils/request/transform';
import { IsPasswordStrong, IsPhoneNumber } from '@/utils/request/validation';

export class AuthSignUpDto {
  @NormalizeEmail()
  readonly email!: string;

  @IsNotEmpty()
  @Length(1, 20)
  @IsNotEmpty()
  @NormalizeStringInput()
  @Type(() => String)
  readonly firstName?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  @IsNotEmpty()
  @NormalizeStringInput()
  @Type(() => String)
  readonly lastName?: string;

  @IsString()
  @IsOptional()
  @Length(10, 20)
  @IsPhoneNumber()
  @NormalizeStringInput()
  @Type(() => String)
  readonly phoneNumber?: string;

  @IsString()
  @IsOptional()
  @Length(2, 30)
  @NormalizeStringInput()
  @Type(() => String)
  readonly title?: string;

  @IsNotEmpty()
  @MaxLength(30)
  @IsPasswordStrong()
  @Trim()
  @Type(() => String)
  readonly password!: string;
}
