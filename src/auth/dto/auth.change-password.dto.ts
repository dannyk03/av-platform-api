import { IsPasswordStrong } from '$/utils/request/validation/request.is-password-strong.validation';
import { Escape, Trim } from 'class-sanitizer';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

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
