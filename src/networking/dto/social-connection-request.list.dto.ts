import { ApiHideProperty } from '@nestjs/swagger';

import {
  EnumNetworkingConnectionRequestStatus,
  IPaginationList,
  IPaginationSort,
} from '@avo/type';

import {
  CONNECT_REQUEST_DEFAULT_AVAILABLE_SEARCH,
  CONNECT_REQUEST_DEFAULT_AVAILABLE_SORT,
  CONNECT_REQUEST_DEFAULT_PAGE,
  CONNECT_REQUEST_DEFAULT_PER_PAGE,
  CONNECT_REQUEST_DEFAULT_SORT,
  ConnectRequestOrderByNestingAliasMap,
} from '../constant';

import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationFilterEnum,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@/utils/pagination';

export class SocialConnectionRequestListDto implements IPaginationList {
  @PaginationSearch()
  readonly search: string;

  @ApiHideProperty()
  @PaginationAvailableSearch(CONNECT_REQUEST_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(CONNECT_REQUEST_DEFAULT_PAGE)
  readonly page: number;

  @PaginationPerPage(CONNECT_REQUEST_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @PaginationSort(
    CONNECT_REQUEST_DEFAULT_SORT,
    CONNECT_REQUEST_DEFAULT_AVAILABLE_SORT,
    ConnectRequestOrderByNestingAliasMap,
  )
  readonly sort: IPaginationSort;

  @ApiHideProperty()
  @PaginationAvailableSort(CONNECT_REQUEST_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];

  @PaginationFilterEnum<EnumNetworkingConnectionRequestStatus>(
    [EnumNetworkingConnectionRequestStatus.Pending],
    EnumNetworkingConnectionRequestStatus,
  )
  readonly status: EnumNetworkingConnectionRequestStatus[];
}
