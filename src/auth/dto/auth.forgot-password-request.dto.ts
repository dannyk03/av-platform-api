import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

import { NormalizeStringInputTransform } from '@/utils/request/transform';

export class AuthForgotPasswordRequestDto {
  @IsNotEmpty()
  @IsEmail()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly email: string;
}
