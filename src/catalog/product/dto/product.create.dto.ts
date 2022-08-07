import { isString } from '@nestjs/common/utils/shared.utils';

import { EnumCurrency } from '@avo/type';

import { Transform, Type } from 'class-transformer';
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
import { EnumDisplayLanguage } from '@/language/display-language/display-language.constant';
import {
  ArrayTransform,
  NormalizeStringInput,
} from '@/utils/request/transform';

export class ProductCreateDto {
  @IsNotEmpty()
  @Length(3, 30)
  @ProductSKU()
  @NormalizeStringInput()
  @Type(() => String)
  readonly sku!: string;

  @IsOptional()
  @MaxLength(30)
  @NormalizeStringInput()
  readonly brand?: string;

  @MaxLength(30)
  @NormalizeStringInput()
  readonly name!: string;

  @MaxLength(200)
  @NormalizeStringInput()
  readonly description!: string;

  @ProductDisplayLanguage()
  language!: EnumDisplayLanguage;

  @IsArray()
  @IsOptional()
  @ArrayTransform()
  @NormalizeStringInput({ each: true })
  keywords?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  price!: number;

  @ProductCurrency()
  currency: EnumCurrency;
}
