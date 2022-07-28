import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { isString } from 'lodash';

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

  @IsString()
  @IsOptional()
  @MaxLength(30)
  @NormalizeStringInput()
  readonly brand?: string;

  @IsString()
  @MaxLength(30)
  @NormalizeStringInput()
  readonly name!: string;

  @IsString()
  @MaxLength(200)
  @NormalizeStringInput()
  readonly description!: string;

  @ProductDisplayLanguage()
  languageIsoCode: EnumDisplayLanguage;

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
