import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  NormalizeEmail,
  NormalizeStringInputTransform,
  TrimTransform,
} from '@/utils/request/transform';
import { IsPasswordStrong } from '@/utils/request/validation';

export class UserCreateDto {
  @NormalizeEmail()
  readonly email: string;

  @MaxLength(30)
  @IsOptional()
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly firstName?: string;

  @MaxLength(30)
  @IsOptional()
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly lastName?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(14)
  @IsPhoneNumber()
  @NormalizeStringInputTransform()
  readonly phoneNumber?: string;

  @IsNotEmpty()
  @NormalizeStringInputTransform()
  readonly role: string;

  @IsNotEmpty()
  @IsPasswordStrong()
  @TrimTransform()
  @Type(() => String)
  readonly password: string;
}
