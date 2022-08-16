import { EnumDisplayLanguage } from '@avo/type';

import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { ProductDisplayLanguage } from '@/catalog/catalog.decorator';

import {
  ArrayTransform,
  BooleanStringTransform,
  NormalizeStringInputTransform,
  ToLowerCaseTransform,
  UniqueArrayTransform,
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
  readonly description!: string;

  @IsArray()
  @IsOptional()
  @ArrayTransform()
  @NormalizeStringInputTransform({ each: true })
  readonly keywords?: string[];
}

export class ProductUpdateDto {
  @IsOptional()
  @MaxLength(30)
  @NormalizeStringInputTransform()
  readonly brand?: string;

  @IsBoolean()
  @IsOptional()
  @BooleanStringTransform()
  isActive?: boolean;

  @ProductDisplayLanguage()
  @IsOptional()
  language: EnumDisplayLanguage;

  @IsOptional()
  @MaxLength(30)
  @NormalizeStringInputTransform()
  readonly name?: string;

  @MaxLength(200)
  @NormalizeStringInputTransform()
  readonly description!: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ArrayTransform()
  @UniqueArrayTransform()
  @NormalizeStringInputTransform({ each: true })
  @ToLowerCaseTransform({ each: true })
  readonly keywords?: string[];

  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  vendorId?: string;

  @IsNotEmpty()
  @MaxLength(30)
  @IsOptional()
  vendorName?: string;

  @IsArray()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  @UniqueArrayTransform()
  @ArrayTransform()
  deleteImageIds: string[];

  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  price!: number;
}
