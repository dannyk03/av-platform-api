import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

import {
  EmptyStringToUndefinedTransform,
  NormalizeEmail,
  NormalizeStringInputTransform,
  TrimTransform,
} from '@/utils/request/transform';
import { IsPasswordStrong, IsPhoneNumber } from '@/utils/request/validation';

export class AuthSignUpDto {
  @NormalizeEmail()
  readonly email!: string;

  @IsNotEmpty()
  @Length(1, 20)
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly firstName?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly lastName?: string;

  @IsString()
  @IsOptional()
  @EmptyStringToUndefinedTransform()
  @Length(10, 20)
  @IsPhoneNumber()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly phoneNumber?: string;

  @IsString()
  @IsOptional()
  @EmptyStringToUndefinedTransform()
  @Length(2, 50)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly title?: string;

  @IsNotEmpty()
  @MaxLength(30)
  @IsPasswordStrong()
  @TrimTransform()
  @Type(() => String)
  readonly password!: string;
}
