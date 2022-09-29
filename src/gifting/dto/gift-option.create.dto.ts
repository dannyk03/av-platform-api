import { ApiProperty } from '@nestjs/swagger';

import { EnumDisplayLanguage } from '@avo/type';

import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

import { ProductDisplayLanguage } from '@/catalog/decorator';

import {
  ArrayTransform,
  UniqueArrayByTransform,
} from '@/utils/request/transform';

export class GiftOptionCreateDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  @UniqueArrayByTransform()
  @ArrayTransform()
  @ApiProperty()
  readonly productIds!: string[];

  @ProductDisplayLanguage()
  @IsOptional()
  @ApiProperty({ required: false })
  readonly lang?: EnumDisplayLanguage;
}
