import { Escape, NormalizeEmail, Trim } from 'class-sanitizer';
import { Type } from 'class-transformer';
import { IsEmail, Length, MaxLength } from 'class-validator';

import { IsPasswordStrong } from '@/utils/request/validation';

export class OrganizationCreateDto {
  @IsEmail()
  @MaxLength(50)
  @NormalizeEmail(true)
  @Trim()
  @Escape()
  readonly email!: string;

  @MaxLength(30)
  @IsPasswordStrong()
  @Trim()
  @Type(() => String)
  readonly password!: string;

  @Length(2, 30)
  @Escape()
  @Trim()
  @Type(() => String)
  readonly name!: string;
}
