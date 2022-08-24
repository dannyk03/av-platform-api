import { EnumDisplayLanguage } from '@avo/type';

import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

import { ProductDisplayLanguage } from '@/catalog';
import { NormalizeStringInputTransform } from '@/utils/request/transform';

export class MagicLinkDto {
  @IsNotEmpty()
  @Length(21, 21)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly code: string;

  @ProductDisplayLanguage()
  @IsOptional()
  readonly lang: EnumDisplayLanguage;
}
