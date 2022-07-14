import { IsString, IsNotEmpty } from 'class-validator';
import { Escape, Trim } from 'class-sanitizer';
import { IsPasswordStrong } from '@/utils/request/validation/request.is-password-strong.validation';
import { Type } from 'class-transformer';

export class AuthChangePasswordDto {
  @IsPasswordStrong()
  @IsNotEmpty()
  @Trim()
  @Escape()
  @Type(() => String)
  readonly newPassword: string;

  @IsNotEmpty()
  @Trim()
  @Escape()
  @Type(() => String)
  readonly oldPassword: string;
}
