import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { NormalizeEmail } from '@/utils/request/transform';

export class AuthSignUpRefDto {
  @IsOptional()
  @NormalizeEmail()
  @Type(() => String)
  readonly ref: string;
}
