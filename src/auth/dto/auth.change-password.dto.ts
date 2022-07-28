import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { Trim } from '@/utils/request/transform';
import { IsPasswordStrong } from '@/utils/request/validation';

export class AuthChangePasswordDto {
  @IsPasswordStrong()
  @IsNotEmpty()
  @Trim()
  @Type(() => String)
  readonly newPassword: string;

  @IsNotEmpty()
  @Trim()
  @Type(() => String)
  readonly oldPassword: string;
}
