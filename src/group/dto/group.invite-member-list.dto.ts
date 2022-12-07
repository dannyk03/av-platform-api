import { ApiHideProperty } from '@nestjs/swagger';

import {
  EnumGroupInviteStatus,
  IPaginationList,
  IPaginationSort,
} from '@avo/type';

import { EnumGroupInviteType } from '../type';

import {
  GROUP_INVITE_DEFAULT_AVAILABLE_SEARCH,
  GROUP_INVITE_DEFAULT_AVAILABLE_SORT,
  GROUP_INVITE_DEFAULT_PAGE,
  GROUP_INVITE_DEFAULT_PER_PAGE,
  GROUP_INVITE_DEFAULT_SORT,
  GroupInviteOrderByNestingAliasMap,
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

export class GroupInviteListDto implements IPaginationList {
  @PaginationSearch()
  readonly search: string;

  @ApiHideProperty()
  @PaginationAvailableSearch(GROUP_INVITE_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(GROUP_INVITE_DEFAULT_PAGE)
  readonly page: number;

  @PaginationPerPage(GROUP_INVITE_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @PaginationSort(
    GROUP_INVITE_DEFAULT_SORT,
    GROUP_INVITE_DEFAULT_AVAILABLE_SORT,
    GroupInviteOrderByNestingAliasMap,
  )
  readonly sort: IPaginationSort;

  @ApiHideProperty()
  @PaginationAvailableSort(GROUP_INVITE_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];

  @PaginationFilterEnum<EnumGroupInviteStatus>(
    [EnumGroupInviteStatus.Pending],
    EnumGroupInviteStatus,
  )
  readonly status: EnumGroupInviteStatus;

  @PaginationFilterEnum<EnumGroupInviteType>(
    [EnumGroupInviteType.Incoming],
    EnumGroupInviteType,
  )
  readonly type: EnumGroupInviteType;
}
