import { EnumCurrency, EnumDisplayLanguage } from '@avo/type';

import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator';

import { ProductCurrency, ProductDisplayLanguage, ProductSKU } from '@/catalog';
import {
  ArrayTransform,
  LowerCaseArray,
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

  @IsOptional()
  @MaxLength(200)
  @NormalizeStringInput()
  readonly description!: string;

  @ProductDisplayLanguage()
  @IsOptional()
  language!: EnumDisplayLanguage;

  @IsArray()
  @IsOptional()
  @ArrayTransform()
  @LowerCaseArray()
  @NormalizeStringInput({ each: true })
  keywords?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  @Type(() => Number)
  price!: number;

  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  @Type(() => Number)
  shippingCost!: number;

  @MaxLength(200)
  @NormalizeStringInput()
  readonly taxCode!: string;

  @ProductCurrency()
  @IsOptional()
  currency?: EnumCurrency;

  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  vendorId!: string;
}
