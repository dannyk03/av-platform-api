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
import { IsStartWith, IsPasswordStrong } from '@/utils/request/validation';
import { IsMobileNumber } from '@/utils/request/validation/request.is-mobile-number.validation';

IsPasswordStrong;

export class AuthSignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  readonly firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  readonly lastName!: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(20)
  @IsMobileNumber()
  readonly mobileNumber!: string;

  @IsNotEmpty()
  @IsPasswordStrong()
  readonly password!: string;
}
