import { Transform, Type } from 'class-transformer';
import { Escape, Trim } from 'class-sanitizer';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  MaxLength,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { isString } from 'lodash';
import { EnumDisplayLanguage } from '@/language/display-language/display-language.constant';
import { ProductDisplayLanguage, ProductSKU } from '@/catalog';

export class ProductCreateDto {
  @IsNotEmpty()
  @Length(3, 30)
  @ProductSKU()
  @Trim()
  @Escape()
  @Type(() => String)
  readonly sku!: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  @Trim()
  @Escape()
  readonly brand?: string;

  @IsString()
  @MaxLength(30)
  @Trim()
  @Escape()
  readonly name!: string;

  @IsString()
  @MaxLength(200)
  @Trim()
  @Escape()
  readonly description!: string;

  @ProductDisplayLanguage()
  languageIsoCode: EnumDisplayLanguage;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    return isString(value) ? JSON.parse(value) : value;
  })
  @Trim(undefined, { each: true })
  @Escape({ each: true })
  keywords?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
