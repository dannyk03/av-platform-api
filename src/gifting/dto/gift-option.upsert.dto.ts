import { ApiProperty } from '@nestjs/swagger';

import { EnumDisplayLanguage } from '@avo/type';

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
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

export class GiftOptionUpsetDto {
  @IsUUID()
  @IsOptional()
  @IsNotEmpty()
  readonly giftOptionId: string;

  @ArrayMaxSize(3)
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  @UniqueArrayByTransform()
  @ArrayTransform()
  readonly productIds?: string[];

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
