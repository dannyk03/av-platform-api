import { EnumDisplayLanguage } from '@avo/type';

import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

import {
  ProductDisplayLanguage,
  ProductSKU,
} from '@/catalog/catalog.decorator';

import {
  ArrayTransform,
  NormalizeStringInput,
  ToLowerCaseTransform,
  UniqueArray,
} from '@/utils/request/transform';

export class ProductUpdateDisplayDto {
  @ProductDisplayLanguage()
  @IsOptional()
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
  readonly keywords?: string[];
}

export class ProductUpdateDto {
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

  @ProductDisplayLanguage()
  @IsOptional()
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
  @IsString({ each: true })
  @ArrayTransform()
  @UniqueArray()
  @NormalizeStringInput({ each: true })
  @ToLowerCaseTransform({ each: true })
  readonly keywords?: string[];
}
