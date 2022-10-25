import { ApiProperty } from '@nestjs/swagger';

import { EnumDisplayLanguage } from '@avo/type';

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { ProductDisplayLanguage } from '@/catalog/decorator';

import {
  ArrayTransform,
  NormalizeStringInputTransform,
  UniqueArrayByTransform,
} from '@/utils/request/transform';

export class GiftOptionCreateDto {
  @ArrayMinSize(1)
  // According to the designs there is currently no support for bundles/multiple products within Gift, That's why max products length is 1.
  @ArrayMaxSize(1)
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  @UniqueArrayByTransform()
  @ArrayTransform()
  @ApiProperty()
  readonly productIds!: string[];

  @IsString()
  @MaxLength(1000)
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  @ApiProperty()
  readonly matchReason?: string;

  @ProductDisplayLanguage()
  @IsOptional()
  @ApiProperty({ required: false })
  readonly lang?: EnumDisplayLanguage;
}
