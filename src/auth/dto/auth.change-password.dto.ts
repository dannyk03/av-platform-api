import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { TrimTransform } from '@/utils/request/transform';
import { IsPasswordStrong } from '@/utils/request/validation';

export class AuthChangePasswordDto {
  @IsPasswordStrong()
  @IsNotEmpty()
  @TrimTransform()
  @Type(() => String)
  readonly newPassword: string;

  @IsNotEmpty()
  @TrimTransform()
  @Type(() => String)
  readonly oldPassword: string;
}
