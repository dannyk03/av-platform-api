import { EnumCurrency, EnumDisplayLanguage } from '@avo/type';

import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';

import { ProductCurrency, ProductDisplayLanguage, ProductSKU } from '@/catalog';
import {
  ArrayTransform,
  NormalizeStringInput,
} from '@/utils/request/transform';

export class VendorCreateDto {
  @MaxLength(30)
  @NormalizeStringInput()
  readonly name!: string;

  @MaxLength(200)
  @NormalizeStringInput()
  readonly description!: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
