import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import {
  NormalizeStringInputTransform,
  TrimTransform,
} from '@/utils/request/transform';
import { IsPasswordStrong } from '@/utils/request/validation';

export class OrganizationJoinDto {
  @IsString()
  @IsOptional()
  @MaxLength(30)
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly lastName?: string;

  @IsNotEmpty()
  @MaxLength(30)
  @IsPasswordStrong()
  @TrimTransform()
  @Type(() => String)
  readonly password!: string;
}
