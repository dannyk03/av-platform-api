import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import {
  NormalizeEmail,
  NormalizeStringInput,
  Trim,
} from '@/utils/request/transform';

export class AuthLoginDto {
  @NormalizeEmail()
  readonly email: string;

  @IsOptional()
  @IsBoolean()
  readonly rememberMe?: boolean;

  @IsNotEmpty()
  @MaxLength(30)
  @Trim()
  @Type(() => String)
  readonly password: string;
}

export class AuthMagicLoginDto {
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
}
