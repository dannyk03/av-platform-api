import { EnumDisplayLanguage } from '@avo/type';

import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { ProductDisplayLanguage } from '@/catalog/decorator/catalog.decorator';

import {
  ArrayTransform,
  BooleanStringTransform,
  NormalizeStringInputTransform,
  ToLowerCaseTransform,
  UniqueArrayByTransform,
} from '@/utils/request/transform';

export class ProductUpdateDisplayDto {
  @ProductDisplayLanguage()
  @IsOptional()
  language: EnumDisplayLanguage;

  @IsOptional()
  @MaxLength(30)
  @IsString()
  @NormalizeStringInputTransform()
  readonly name?: string;

  @MaxLength(200)
  @IsString()
  @NormalizeStringInputTransform()
  readonly description?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ArrayTransform()
  @NormalizeStringInputTransform({ each: true })
  readonly keywords?: string[];
}

export class ProductUpdateDto {
  @IsOptional()
  @MaxLength(30)
  @MinLength(1)
  @IsString()
  @NormalizeStringInputTransform()
  readonly brand?: string;

  @IsBoolean()
  @IsOptional()
  @BooleanStringTransform()
  readonly isActive?: boolean;

  @ProductDisplayLanguage()
  @IsOptional()
  language: EnumDisplayLanguage;

  @IsOptional()
  @MaxLength(50)
  @MinLength(1)
  @IsString()
  @NormalizeStringInputTransform()
  readonly name?: string;

  @MaxLength(200)
  @IsOptional()
  @IsString()
  @NormalizeStringInputTransform()
  readonly description?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ArrayTransform()
  @UniqueArrayByTransform()
  @NormalizeStringInputTransform({ each: true })
  @ToLowerCaseTransform({ each: true })
  readonly keywords?: string[];

  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  vendorId?: string;

  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(1)
  @IsOptional()
  @IsString()
  @NormalizeStringInputTransform()
  vendorName?: string;

  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(1)
  @IsOptional()
  @IsString()
  @NormalizeStringInputTransform()
  taxCode?: string;

  @IsArray()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  @UniqueArrayByTransform()
  @ArrayTransform()
  deleteImageIds?: string[];

  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  shippingCost?: number;

  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  @IsOptional()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  price?: number;
}
