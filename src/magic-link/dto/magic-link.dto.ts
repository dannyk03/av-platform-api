import { Type } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';

import { NormalizeStringInput } from '@/utils/request/transform';

export class MagicLinkDto {
  @IsNotEmpty()
  @Length(21, 21)
  @NormalizeStringInput()
  @Type(() => String)
  readonly code: string;
}
