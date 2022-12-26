import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { IPaginationList, IPaginationSort } from '@avo/type';

import {
  GROUP_MEMBER_DEFAULT_AVAILABLE_SEARCH,
  GROUP_MEMBER_DEFAULT_AVAILABLE_SORT,
  GROUP_MEMBER_DEFAULT_PAGE,
  GROUP_MEMBER_DEFAULT_PER_PAGE,
  GROUP_MEMBER_DEFAULT_SORT,
  GroupMemberOrderByNestingAliasMap,
} from '../constant';

import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@/utils/pagination';

export class MemberListDto implements IPaginationList {
  @PaginationSearch()
  @ApiProperty()
  readonly search: string;

  @ApiHideProperty()
  @PaginationAvailableSearch(GROUP_MEMBER_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(GROUP_MEMBER_DEFAULT_PAGE)
  @ApiProperty({ default: GROUP_MEMBER_DEFAULT_PAGE })
  readonly page: number;

  @PaginationPerPage(GROUP_MEMBER_DEFAULT_PER_PAGE)
  @ApiProperty({ default: GROUP_MEMBER_DEFAULT_PER_PAGE })
  readonly perPage: number;

  @PaginationSort(
    GROUP_MEMBER_DEFAULT_SORT,
    GROUP_MEMBER_DEFAULT_AVAILABLE_SORT,
    GroupMemberOrderByNestingAliasMap,
  )
  @ApiProperty()
  readonly sort: IPaginationSort;

  @ApiHideProperty()
  @PaginationAvailableSort(GROUP_MEMBER_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];
}
