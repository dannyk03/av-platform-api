import { EnumPaginationAvailableSortType } from './pagination.constant';

export interface IPaginationOptions {
  limit?: number;
  skip?: number;
  sort?: Record<string, EnumPaginationAvailableSortType>;
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
