import { Escape, Trim } from 'class-sanitizer';
import { Type, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsBoolean,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  @MaxLength(50)
  @Transform(({ value }) => value.toLowerCase())
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
  @IsEmail()
  @MaxLength(50)
  @Transform(({ value }) => value.toLowerCase())
  @Trim()
  @Escape()
  readonly email: string;

  @MaxLength(30)
  @IsOptional()
  @ValidateIf((e) => e.lastName !== '')
  @Trim()
  @Escape()
  @Type(() => String)
  readonly firstName?: string;

  @MaxLength(30)
  @IsOptional()
  @ValidateIf((e) => e.lastName !== '')
  @Trim()
  @Escape()
  @Type(() => String)
  readonly lastName?: string;
}
