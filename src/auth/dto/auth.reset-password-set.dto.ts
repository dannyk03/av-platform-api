import { Type } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';

import { TrimTransform } from '@/utils/request/transform';
import { IsPasswordStrong } from '@/utils/request/validation';

export class AuthResetPasswordSetDto {
  @IsNotEmpty()
  @MaxLength(30)
  @IsPasswordStrong()
  @TrimTransform()
  @Type(() => String)
  readonly password!: string;
}
