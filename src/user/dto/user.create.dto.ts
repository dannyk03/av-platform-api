import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Escape, Trim } from 'class-sanitizer';
import { IsPasswordStrong } from '@/utils/request/validation/request.is-password-strong.validation';

export class UserCreateDto {
  @IsEmail()
  @MaxLength(50)
  @Transform(({ value }) => value?.toLowerCase())
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

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(14)
  @IsPhoneNumber()
  @Trim()
  @Escape()
  readonly phoneNumber?: string;

  @IsNotEmpty()
  @Trim()
  @Escape()
  readonly role: string;

  @IsNotEmpty()
  @IsPasswordStrong()
  @Trim()
  @Type(() => String)
  readonly password: string;
}
