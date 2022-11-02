import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import {
  EnumDisplayLanguage,
  IPaginationList,
  IPaginationSort,
} from '@avo/type';

import { ProductDisplayLanguage } from '@/catalog/decorator';

import {
  GIFT_INTENT_DEFAULT_AVAILABLE_SEARCH,
  GIFT_INTENT_DEFAULT_AVAILABLE_SORT,
  GIFT_INTENT_DEFAULT_PAGE,
  GIFT_INTENT_DEFAULT_PER_PAGE,
  GIFT_INTENT_DEFAULT_SORT,
  GiftIntentOrderByNestingAliasMap,
} from '../constant';

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
  @ApiProperty()
  readonly search: string;

  @PaginationMultiSearch()
  @ApiProperty()
  readonly keywords: string[];

  @ApiHideProperty()
  @PaginationAvailableSearch(GIFT_INTENT_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(GIFT_INTENT_DEFAULT_PAGE)
  @ApiProperty({ default: GIFT_INTENT_DEFAULT_PAGE })
  readonly page: number;

  @PaginationPerPage(GIFT_INTENT_DEFAULT_PER_PAGE)
  @ApiProperty({ default: GIFT_INTENT_DEFAULT_PER_PAGE })
  readonly perPage: number;

  @PaginationSort(
    GIFT_INTENT_DEFAULT_SORT,
    GIFT_INTENT_DEFAULT_AVAILABLE_SORT,
    GiftIntentOrderByNestingAliasMap,
  )
  readonly sort: IPaginationSort;

  @ApiHideProperty()
  @PaginationAvailableSort(GIFT_INTENT_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];

  @ProductDisplayLanguage()
  readonly lang: EnumDisplayLanguage;
}
