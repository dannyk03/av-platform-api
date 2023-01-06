import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { IPaginationList, IPaginationSort } from '@avo/type';

import {
  GROUP_QUESTION_DEFAULT_AVAILABLE_SEARCH,
  GROUP_QUESTION_DEFAULT_AVAILABLE_SORT,
  GROUP_QUESTION_DEFAULT_PAGE,
  GROUP_QUESTION_DEFAULT_PER_PAGE,
  GROUP_QUESTION_DEFAULT_SORT,
  GroupQuestionOrderByNestingAliasMap,
} from '@/group/constant';

import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationPage,
  PaginationPerPage,
  PaginationSort,
} from '@/utils/pagination';

export class GroupQuestionListDto implements IPaginationList {
  @ApiProperty({ default: GROUP_QUESTION_DEFAULT_PAGE })
  @PaginationPage(GROUP_QUESTION_DEFAULT_PAGE)
  readonly page: number;

  @ApiProperty({ default: GROUP_QUESTION_DEFAULT_PER_PAGE })
  @PaginationPerPage(GROUP_QUESTION_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @PaginationSort(
    GROUP_QUESTION_DEFAULT_SORT,
    GROUP_QUESTION_DEFAULT_AVAILABLE_SORT,
    GroupQuestionOrderByNestingAliasMap,
  )
  readonly sort: IPaginationSort;

  @ApiHideProperty()
  @PaginationAvailableSearch(GROUP_QUESTION_DEFAULT_AVAILABLE_SEARCH)
  availableSearch: string[];

  @ApiHideProperty()
  @PaginationAvailableSort(GROUP_QUESTION_DEFAULT_AVAILABLE_SORT)
  availableSort: string[];
}
