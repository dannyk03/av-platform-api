import { isString } from '@nestjs/common/utils/shared.utils';

import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';

import { ProductDisplayLanguage, ProductSKU } from '@/catalog';
import { EnumDisplayLanguage } from '@/language/display-language/display-language.constant';
import { NormalizeStringInput } from '@/utils/request/transform';

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
  language: EnumDisplayLanguage;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    return isString(value) ? JSON.parse(value) : value;
  })
  @NormalizeStringInput({ each: true })
  keywords?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
