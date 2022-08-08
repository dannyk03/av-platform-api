import { IPaginationSort } from '@avo/type';

export interface IPaginationOptions {
  take?: number;
  skip?: number;
  order?: IPaginationSort;
}

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
