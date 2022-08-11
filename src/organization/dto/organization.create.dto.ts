import { Type } from 'class-transformer';
import { Length, MaxLength } from 'class-validator';

import {
  NormalizeEmail,
  NormalizeStringInput,
  Trim,
} from '@/utils/request/transform';
import { IsPasswordStrong } from '@/utils/request/validation';

export class OrganizationCreateDto {
  @NormalizeEmail()
  readonly email!: string;

  @MaxLength(30)
  @IsPasswordStrong()
  @Trim()
  @Type(() => String)
  readonly password!: string;

  @Length(2, 30)
  @NormalizeStringInput()
  @Type(() => String)
  readonly name!: string;
}
