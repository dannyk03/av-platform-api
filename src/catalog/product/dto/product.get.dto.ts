import { ProductDisplayLanguage } from '../product.decorator';

import { EnumDisplayLanguage } from '@/language/display-language';

export class ProductGetDto {
  @ProductDisplayLanguage()
  lang: EnumDisplayLanguage;
}
