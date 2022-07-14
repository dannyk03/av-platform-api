import { Type } from 'class-transformer';
import { Escape, Trim } from 'class-sanitizer';
import {
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  @Trim()
  @Escape()
  readonly email: string;

  @IsOptional()
  @IsBoolean()
  readonly rememberMe?: boolean;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly password: string;
}
export class AuthMagicLoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  @Trim()
  @Escape()
  readonly email: string;

  @MaxLength(50)
  @IsOptional()
  @Trim()
  @Escape()
  readonly firstName?: string;

  @MaxLength(50)
  @IsOptional()
  @Trim()
  @Escape()
  readonly lastName?: string;
}
