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

export class GiftOptionUpdateDto {
  @IsUUID()
  @IsNotEmpty()
  readonly giftOptionId: string;

  @IsOptional()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  @UniqueArrayByTransform()
  @ArrayTransform()
  readonly addProductIds?: string[];

  @IsOptional()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  @UniqueArrayByTransform()
  @ArrayTransform()
  readonly deleteProductIds?: string[];

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
  readonly lang?: EnumDisplayLanguage;
}
