import { ApiProperty } from '@nestjs/swagger';

import { EnumDisplayLanguage } from '@avo/type';

import { IsOptional } from 'class-validator';

import { ProductDisplayLanguage } from '../product.decorator';

export class ProductGetDto {
  @ProductDisplayLanguage()
  @IsOptional()
  @ApiProperty()
  readonly lang: EnumDisplayLanguage;
}
