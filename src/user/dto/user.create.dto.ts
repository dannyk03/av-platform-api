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
import { IsPasswordStrong } from 'src/utils/request/validation/request.is-password-strong.validation';

export class UserCreateDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @Type(() => String)
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  readonly firstName: string;

  @IsString()
  @IsOptional()
  @ValidateIf((e) => e.lastName !== '')
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  readonly lastName?: string;

  @IsNotEmpty()
  @IsPasswordStrong()
  readonly password: string;
}
