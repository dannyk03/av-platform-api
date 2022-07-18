import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Escape, Trim } from 'class-sanitizer';
import { IsPasswordStrong } from '@/utils/request/validation';
import { IsPhoneNumber } from '@/utils/request/validation/request.is-mobile-number.validation';

export class AuthSignUpDto {
  @IsEmail()
  @MaxLength(50)
  @Transform(({ value }) => value?.toLowerCase())
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
