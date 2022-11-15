import { Type } from 'class-transformer';
import { IsString, Length, MaxLength } from 'class-validator';

import {
  NormalizeEmail,
  NormalizeStringInputTransform,
  TrimTransform,
} from '@/utils/request/transform';
import { IsPasswordStrong } from '@/utils/request/validation';

export class OrganizationCreateDto {
  @NormalizeEmail()
  readonly email!: string;

  @MaxLength(30)
  @IsPasswordStrong()
  @TrimTransform()
  @Type(() => String)
  readonly password!: string;

  @Length(2, 30)
  @IsString()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly name!: string;
}
