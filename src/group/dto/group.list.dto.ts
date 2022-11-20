import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { IPaginationList, IPaginationSort } from '@avo/type';

import {
  GROUP_DEFAULT_ACTIVE,
  GROUP_DEFAULT_AVAILABLE_SEARCH,
  GROUP_DEFAULT_AVAILABLE_SORT,
  GROUP_DEFAULT_PAGE,
  GROUP_DEFAULT_PER_PAGE,
  GROUP_DEFAULT_SORT,
  ProductOrderByNestingAliasMap,
} from '../constant';

import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationFilterBoolean,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@/utils/pagination';

export class GroupListDto implements IPaginationList {
  @PaginationSearch()
  readonly search: string;

  @ApiHideProperty()
  @PaginationAvailableSearch(GROUP_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @ApiProperty({ default: GROUP_DEFAULT_PAGE })
  @PaginationPage(GROUP_DEFAULT_PAGE)
  readonly page: number;

  @ApiProperty({ default: GROUP_DEFAULT_PER_PAGE })
  @PaginationPerPage(GROUP_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @ApiProperty()
  @PaginationSort(
    GROUP_DEFAULT_SORT,
    GROUP_DEFAULT_AVAILABLE_SORT,
    ProductOrderByNestingAliasMap,
  )
  readonly sort: IPaginationSort;

  @ApiHideProperty()
  @PaginationAvailableSort(GROUP_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];

  @ApiProperty({ default: GROUP_DEFAULT_ACTIVE })
  @PaginationFilterBoolean(GROUP_DEFAULT_ACTIVE)
  readonly isActive: boolean[];
}
