import { ApiHideProperty } from '@nestjs/swagger';

import { IPaginationList, IPaginationSort } from '@avo/type';

import {
  CONNECTIONS_DEFAULT_AVAILABLE_SEARCH,
  CONNECTIONS_DEFAULT_AVAILABLE_SORT,
  CONNECTIONS_DEFAULT_PAGE,
  CONNECTIONS_DEFAULT_PER_PAGE,
  CONNECTIONS_DEFAULT_SORT,
  ConnectionsOrderByNestingAliasMap,
} from '../constant';

import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@/utils/pagination';

export class SocialConnectionListDto implements IPaginationList {
  @PaginationSearch()
  readonly search: string;

  @ApiHideProperty()
  @PaginationAvailableSearch(CONNECTIONS_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(CONNECTIONS_DEFAULT_PAGE)
  readonly page: number;

  @PaginationPerPage(CONNECTIONS_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @PaginationSort(
    CONNECTIONS_DEFAULT_SORT,
    CONNECTIONS_DEFAULT_AVAILABLE_SORT,
    ConnectionsOrderByNestingAliasMap,
  )
  readonly sort: IPaginationSort;

  @ApiHideProperty()
  @PaginationAvailableSort(CONNECTIONS_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];
}
