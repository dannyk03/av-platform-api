import { EnumDisplayLanguage } from '@/language/display-language';

import { EnumPaginationAvailableSortType } from './pagination.constant';

export interface IPaginationList {
  search?: string;
  lang?: EnumDisplayLanguage;
  availableSearch: string[];
  page: number;
  perPage: number;
  sort: IPaginationSort;
  availableSort: string[];
}

export interface IPaginationOptions {
  take?: number;
  skip?: number;
  order?: Record<string, EnumPaginationAvailableSortType>;
}

export type IPaginationSort = Record<string, EnumPaginationAvailableSortType>;

export interface IPaginationFilterOptions {
  required?: boolean;
}

export interface IPaginationFilterDateOptions extends IPaginationFilterOptions {
  asEndDate?: {
    moreThanField: string;
  };
}

export interface IPaginationFilterStringOptions
  extends IPaginationFilterOptions {
  lowercase?: boolean;
}
