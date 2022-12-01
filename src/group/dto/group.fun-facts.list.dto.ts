import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { IPaginationList, IPaginationSort } from '@avo/type';

import {
  GROUP_FUN_FACTS_DEFAULT_AVAILABLE_SEARCH,
  GROUP_FUN_FACTS_DEFAULT_AVAILABLE_SORT,
  GROUP_FUN_FACTS_DEFAULT_PAGE,
  GROUP_FUN_FACTS_DEFAULT_PER_PAGE,
  GROUP_FUN_FACTS_DEFAULT_SORT,
} from '../constant';

import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@/utils/pagination';

export class GroupFunFactsListDto implements IPaginationList {
  @PaginationSearch()
  readonly search: string;

  @ApiHideProperty()
  @PaginationAvailableSearch(GROUP_FUN_FACTS_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @ApiProperty({ default: GROUP_FUN_FACTS_DEFAULT_PAGE })
  @PaginationPage(GROUP_FUN_FACTS_DEFAULT_PAGE)
  readonly page: number;

  @ApiProperty({ default: GROUP_FUN_FACTS_DEFAULT_PER_PAGE })
  @PaginationPerPage(GROUP_FUN_FACTS_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @ApiProperty()
  @PaginationSort(
    GROUP_FUN_FACTS_DEFAULT_SORT,
    GROUP_FUN_FACTS_DEFAULT_AVAILABLE_SORT,
  )
  readonly sort: IPaginationSort;

  @ApiHideProperty()
  @PaginationAvailableSort(GROUP_FUN_FACTS_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];
}
