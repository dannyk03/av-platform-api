import { EnumDisplayLanguage } from '@/language/display-language';
import { IPaginationOptions } from '@/utils/pagination';

export interface IProductSearch {
  language: EnumDisplayLanguage;
  search?: string;
  keywords?: string[];
  loadImages?: boolean;
  options?: IPaginationOptions;
  isActive?: boolean[];
  priceRange?: [number, number];
}

export interface IGetProduct {
  id: string;
  language: EnumDisplayLanguage;
}

export interface IProductUpdate {
  id: string;
  sku?: string;
  brand?: string;
  isActive?: boolean;
  display?: {
    name?: string;
    description?: string;
    keywords?: string[];
    language: EnumDisplayLanguage;
  };
}
