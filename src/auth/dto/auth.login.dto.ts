import { Escape, NormalizeEmail, Trim } from 'class-sanitizer';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class AuthLoginDto {
  @MaxLength(50)
  @IsEmail()
  @NormalizeEmail(true)
  @Trim()
  @Escape()
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
  @MaxLength(50)
  @IsEmail()
  @NormalizeEmail(true)
  @Trim()
  @Escape()
  readonly email: string;

  @MaxLength(30)
  @IsOptional()
  @IsNotEmpty()
  @Trim()
  @Escape()
  @Type(() => String)
  readonly firstName?: string;

  @MaxLength(30)
  @IsOptional()
  @IsNotEmpty()
  @Trim()
  @Escape()
  @Type(() => String)
  readonly lastName?: string;
}
