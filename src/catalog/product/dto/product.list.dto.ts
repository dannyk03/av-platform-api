import { EnumDisplayLanguage } from '@/language/display-language';
import {
  IPaginationSort,
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationFilterBoolean,
  PaginationLanguage,
  PaginationListAbstract,
  PaginationMultiSearch,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@/utils/pagination';

import {
  PRODUCT_DEFAULT_ACTIVE,
  PRODUCT_DEFAULT_AVAILABLE_SEARCH,
  PRODUCT_DEFAULT_AVAILABLE_SORT,
  PRODUCT_DEFAULT_PAGE,
  PRODUCT_DEFAULT_PER_PAGE,
  PRODUCT_DEFAULT_SORT,
  ProductNestingAliasMap,
} from '../product.constant';

export class ProductListDto implements PaginationListAbstract {
  @PaginationLanguage()
  lang: EnumDisplayLanguage;

  @PaginationSearch(PRODUCT_DEFAULT_AVAILABLE_SEARCH)
  readonly search: string;

  @PaginationMultiSearch()
  readonly keywords: string[];

  @PaginationAvailableSearch(PRODUCT_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(PRODUCT_DEFAULT_PAGE)
  readonly page: number;

  @PaginationPerPage(PRODUCT_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @PaginationSort(
    PRODUCT_DEFAULT_SORT,
    PRODUCT_DEFAULT_AVAILABLE_SORT,
    ProductNestingAliasMap,
  )
  readonly sort: IPaginationSort;

  @PaginationAvailableSort(PRODUCT_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];

  @PaginationFilterBoolean(PRODUCT_DEFAULT_ACTIVE)
  readonly isActive: boolean[];
}
