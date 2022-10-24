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
  EmptyStringToUndefinedTransform,
  NormalizeStringInputTransform,
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

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  @EmptyStringToUndefinedTransform()
  @NormalizeStringInputTransform()
  @Type(() => String)
  @ApiProperty()
  readonly matchReason?: string;

  @ProductDisplayLanguage()
  @IsOptional()
  @ApiProperty({ required: false })
  readonly lang?: EnumDisplayLanguage;
}
