import { EnumDisplayLanguage } from '@/language/display-language';
import { IPaginationOptions } from '@/utils/pagination';

export interface IProductSearch {
  language: EnumDisplayLanguage;
  search?: string;
  keywords?: string[];
  loadImages?: boolean;
  options?: IPaginationOptions;
}
