import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsPasswordStrong } from '@/utils/request/validation/request.is-password-strong.validation';

export class OrganizationCreateDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(30)
  readonly email: string;

  @IsNotEmpty()
  @IsPasswordStrong()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;
}
