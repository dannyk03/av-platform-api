import { EnumCurrency, EnumDisplayLanguage } from '@avo/type';

import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator';

import { ProductCurrency, ProductDisplayLanguage, ProductSKU } from '@/catalog';
import {
  ArrayTransform,
  BooleanStringTransform,
  NormalizeStringInputTransform,
  ToLowerCaseTransform,
} from '@/utils/request/transform';
import { UniqueArrayTransform } from '@/utils/request/transform';

export class ProductCreateDto {
  @IsNotEmpty()
  @Length(3, 30)
  @ProductSKU()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly sku!: string;

  @IsOptional()
  @MaxLength(30)
  @NormalizeStringInputTransform()
  readonly brand?: string;

  @MaxLength(30)
  @NormalizeStringInputTransform()
  readonly name!: string;

  @IsOptional()
  @MaxLength(200)
  @NormalizeStringInputTransform()
  readonly description!: string;

  @ProductDisplayLanguage()
  @IsOptional()
  language!: EnumDisplayLanguage;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @UniqueArrayTransform()
  @ArrayTransform()
  @ToLowerCaseTransform({ each: true })
  @NormalizeStringInputTransform({ each: true })
  keywords?: string[];

  @IsBoolean()
  @IsOptional()
  @BooleanStringTransform()
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
  @NormalizeStringInputTransform()
  readonly taxCode!: string;

  @ProductCurrency()
  @IsOptional()
  currency?: EnumCurrency;

  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  vendorId!: string;
}
