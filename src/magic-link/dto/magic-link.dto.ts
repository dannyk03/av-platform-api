import { ApiProperty } from '@nestjs/swagger';

import { EnumDisplayLanguage } from '@avo/type';

import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

import { ProductDisplayLanguage } from '@/catalog/decorator';

import { NormalizeStringInputTransform } from '@/utils/request/transform';

export class MagicLinkDto {
  @IsNotEmpty()
  @Length(21, 21)
  @IsString()
  @NormalizeStringInputTransform()
  @Type(() => String)
  @ApiProperty()
  readonly code: string;

  @ProductDisplayLanguage()
  @IsOptional()
  @ApiProperty()
  readonly lang: EnumDisplayLanguage;
}
