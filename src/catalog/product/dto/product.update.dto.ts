import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import {
  ProductDisplayLanguage,
  ProductSKU,
} from '@/catalog/catalog.decorator';

import { EnumDisplayLanguage } from '@/language/display-language';
import {
  ArrayTransform,
  NormalizeStringInput,
} from '@/utils/request/transform';

export class ProductUpdateDisplayDto {
  @ProductDisplayLanguage()
  language: EnumDisplayLanguage;

  @IsOptional()
  @MaxLength(30)
  @NormalizeStringInput()
  readonly name?: string;

  @MaxLength(200)
  @NormalizeStringInput()
  readonly description!: string;

  @IsArray()
  @IsOptional()
  @ArrayTransform()
  @NormalizeStringInput({ each: true })
  keywords?: string[];
}

export class ProductUpdateDto {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  readonly id: string;

  @Length(3, 30)
  @ProductSKU()
  @IsOptional()
  @IsNotEmpty()
  @NormalizeStringInput()
  @Type(() => String)
  readonly sku?: string;

  @IsOptional()
  @MaxLength(30)
  @NormalizeStringInput()
  readonly brand?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductUpdateDisplayDto)
  readonly display: ProductUpdateDisplayDto;
}
