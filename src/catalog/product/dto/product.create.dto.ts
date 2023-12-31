import { ApiProperty } from '@nestjs/swagger';

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
  Min,
} from 'class-validator';

import {
  ProductCurrency,
  ProductDisplayLanguage,
  ProductSKU,
} from '@/catalog/decorator';

import {
  ArrayTransform,
  BooleanStringTransform,
  CompactArrayTransform,
  NormalizeStringInputTransform,
  ToLowerCaseTransform,
  UniqueArrayByTransform,
} from '@/utils/request/transform';

export class ProductCreateDto {
  @IsNotEmpty()
  @Length(2, 40)
  @ProductSKU()
  @IsString()
  @NormalizeStringInputTransform()
  @Type(() => String)
  @ApiProperty({ required: false })
  readonly sku!: string;

  @IsOptional()
  @MaxLength(30)
  @IsString()
  @NormalizeStringInputTransform()
  @ApiProperty({ required: false })
  readonly brand?: string;

  @MaxLength(75)
  @IsString()
  @NormalizeStringInputTransform()
  @ApiProperty({ required: false })
  readonly name!: string;

  @IsOptional()
  @MaxLength(1500)
  @IsString()
  @NormalizeStringInputTransform()
  @ApiProperty({ required: false })
  readonly description!: string;

  @ProductDisplayLanguage()
  @IsOptional()
  @ApiProperty({ required: false })
  language!: EnumDisplayLanguage;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @UniqueArrayByTransform()
  @CompactArrayTransform()
  @ArrayTransform()
  @ToLowerCaseTransform({ each: true })
  @NormalizeStringInputTransform({ each: true })
  @ApiProperty({ required: false })
  keywords?: string[];

  @IsBoolean()
  @IsOptional()
  @BooleanStringTransform()
  @ApiProperty({ required: false })
  isActive?: boolean;

  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ required: false })
  price!: number;

  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ required: false })
  shippingCost!: number;

  @MaxLength(200)
  @IsString()
  @NormalizeStringInputTransform()
  @ApiProperty({ required: false })
  readonly taxCode!: string;

  @ProductCurrency()
  @IsOptional()
  @ApiProperty({ required: false })
  currency?: EnumCurrency;

  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  @Type(() => String)
  @ApiProperty({ required: false })
  vendorId!: string;

  @IsNotEmpty()
  @MaxLength(30)
  @ApiProperty({ required: false })
  vendorName?: string;

  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ required: false, default: 0 })
  purchaseCost!: number;

  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ required: false })
  shippingTimeInDays?: number;
}
