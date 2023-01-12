import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { IPaginationList, IPaginationSort } from '@avo/type';

import {
  GROUP_UPCOMING_MILESTONES_DEFAULT_AVAILABLE_SEARCH,
  GROUP_UPCOMING_MILESTONES_DEFAULT_AVAILABLE_SORT,
  GROUP_UPCOMING_MILESTONES_DEFAULT_DAYS,
  GROUP_UPCOMING_MILESTONES_DEFAULT_PAGE,
  GROUP_UPCOMING_MILESTONES_DEFAULT_PER_PAGE,
  GROUP_UPCOMING_MILESTONES_DEFAULT_SORT,
} from '@/group/constant';

import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationFilterDays,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@/utils/pagination';

export class GroupUpcomingMilestonesListDto implements IPaginationList {
  @PaginationSearch()
  readonly search: string;

  @ApiHideProperty()
  @PaginationAvailableSearch(GROUP_UPCOMING_MILESTONES_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @ApiProperty({ default: GROUP_UPCOMING_MILESTONES_DEFAULT_PAGE })
  @PaginationPage(GROUP_UPCOMING_MILESTONES_DEFAULT_PAGE)
  readonly page: number;

  @ApiProperty({ default: GROUP_UPCOMING_MILESTONES_DEFAULT_PER_PAGE })
  @PaginationPerPage(GROUP_UPCOMING_MILESTONES_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @ApiProperty()
  @PaginationSort(
    GROUP_UPCOMING_MILESTONES_DEFAULT_SORT,
    GROUP_UPCOMING_MILESTONES_DEFAULT_AVAILABLE_SORT,
  )
  readonly sort: IPaginationSort;

  @ApiHideProperty()
  @PaginationAvailableSort(GROUP_UPCOMING_MILESTONES_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];

  @PaginationFilterDays(GROUP_UPCOMING_MILESTONES_DEFAULT_DAYS)
  readonly days: number;
}
