import { IsOptional } from 'class-validator';

import { ProductDisplayLanguage } from '../product.decorator';

import { EnumDisplayLanguage } from '@/language/display-language';

export class ProductGetDto {
  @ProductDisplayLanguage()
  @IsOptional()
  lang: EnumDisplayLanguage;
}
