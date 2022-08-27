import {
  EnumDisplayLanguage,
  IPaginationList,
  IPaginationSort,
} from '@avo/type';

import { ProductDisplayLanguage } from '@/catalog/decorators';

import {
  GIFT_INTENT_DEFAULT_AVAILABLE_SEARCH,
  GIFT_INTENT_DEFAULT_AVAILABLE_SORT,
  GIFT_INTENT_DEFAULT_PAGE,
  GIFT_INTENT_DEFAULT_PER_PAGE,
  GIFT_INTENT_DEFAULT_SORT,
  GiftIntentOrderByNestingAliasMap,
} from '../constants';

import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationMultiSearch,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@/utils/pagination';

export class GiftIntentListDto implements IPaginationList {
  @PaginationSearch()
  readonly search: string;

  @PaginationMultiSearch()
  readonly keywords: string[];

  @PaginationAvailableSearch(GIFT_INTENT_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(GIFT_INTENT_DEFAULT_PAGE)
  readonly page: number;

  @PaginationPerPage(GIFT_INTENT_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @PaginationSort(
    GIFT_INTENT_DEFAULT_SORT,
    GIFT_INTENT_DEFAULT_AVAILABLE_SORT,
    GiftIntentOrderByNestingAliasMap,
  )
  readonly sort: IPaginationSort;

  @PaginationAvailableSort(GIFT_INTENT_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];

  @ProductDisplayLanguage()
  readonly lang: EnumDisplayLanguage;
}
