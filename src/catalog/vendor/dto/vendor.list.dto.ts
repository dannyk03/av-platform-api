import { IPaginationList, IPaginationSort } from '@avo/type';

import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationFilterBoolean,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@/utils/pagination';

import {
  VENDOR_DEFAULT_ACTIVE,
  VENDOR_DEFAULT_AVAILABLE_SEARCH,
  VENDOR_DEFAULT_AVAILABLE_SORT,
  VENDOR_DEFAULT_PAGE,
  VENDOR_DEFAULT_PER_PAGE,
  VENDOR_DEFAULT_SORT,
  VendorOrderByNestingAliasMap,
} from '../vendor.constant';

export class VendorListDto implements IPaginationList {
  @PaginationSearch()
  readonly search: string;

  @PaginationAvailableSearch(VENDOR_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(VENDOR_DEFAULT_PAGE)
  readonly page: number;

  @PaginationPerPage(VENDOR_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @PaginationSort(
    VENDOR_DEFAULT_SORT,
    VENDOR_DEFAULT_AVAILABLE_SORT,
    VendorOrderByNestingAliasMap,
  )
  readonly sort: IPaginationSort;

  @PaginationAvailableSort(VENDOR_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];

  @PaginationFilterBoolean(VENDOR_DEFAULT_ACTIVE)
  readonly isActive: boolean[];
}
