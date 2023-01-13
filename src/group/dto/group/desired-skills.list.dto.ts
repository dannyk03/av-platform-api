import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { IPaginationList, IPaginationSort } from '@avo/type';

import {
  GROUP_DESIRED_SKILLS_DEFAULT_AVAILABLE_SEARCH,
  GROUP_DESIRED_SKILLS_DEFAULT_AVAILABLE_SORT,
  GROUP_DESIRED_SKILLS_DEFAULT_PAGE,
  GROUP_DESIRED_SKILLS_DEFAULT_PER_PAGE,
  GROUP_DESIRED_SKILLS_DEFAULT_SORT,
} from '@/group/constant';

import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@/utils/pagination';

export class GroupDesiredSkillsListDto implements IPaginationList {
  @PaginationSearch()
  readonly search: string;

  @ApiHideProperty()
  @PaginationAvailableSearch(GROUP_DESIRED_SKILLS_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @ApiProperty({ default: GROUP_DESIRED_SKILLS_DEFAULT_PAGE })
  @PaginationPage(GROUP_DESIRED_SKILLS_DEFAULT_PAGE)
  readonly page: number;

  @ApiProperty({ default: GROUP_DESIRED_SKILLS_DEFAULT_PER_PAGE })
  @PaginationPerPage(GROUP_DESIRED_SKILLS_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @ApiProperty()
  @PaginationSort(
    GROUP_DESIRED_SKILLS_DEFAULT_SORT,
    GROUP_DESIRED_SKILLS_DEFAULT_AVAILABLE_SORT,
  )
  readonly sort: IPaginationSort;

  @ApiHideProperty()
  @PaginationAvailableSort(GROUP_DESIRED_SKILLS_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];
}
