import { EnumDisplayLanguage } from '@avo/type';

import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

import { ProductDisplayLanguage } from '@/catalog';
import {
  ArrayTransform,
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

  @ProductDisplayLanguage()
  @IsOptional()
  readonly lang?: EnumDisplayLanguage;
}
