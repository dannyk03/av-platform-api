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
  @NormalizeStringInputTransform()
  readonly name?: string;

  @MaxLength(200)
  @NormalizeStringInputTransform()
  readonly description?: string;

  @IsArray()
  @IsOptional()
  @ArrayTransform()
  @NormalizeStringInputTransform({ each: true })
  readonly keywords?: string[];
}

export class ProductUpdateDto {
  @IsOptional()
  @MaxLength(30)
  @MinLength(1)
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
  @NormalizeStringInputTransform()
  readonly name?: string;

  @MaxLength(200)
  @IsOptional()
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
  @NormalizeStringInputTransform()
  vendorName?: string;

  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(1)
  @IsOptional()
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
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  shippingCost?: number;

  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  @IsOptional()
  @IsOptional()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  price?: number;
}
