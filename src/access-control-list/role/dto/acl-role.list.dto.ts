import { ApiProperty } from '@nestjs/swagger';

import { IPaginationList, IPaginationSort } from '@avo/type';

import {
  ROLE_DEFAULT_AVAILABLE_SEARCH,
  ROLE_DEFAULT_AVAILABLE_SORT,
  ROLE_DEFAULT_PAGE,
  ROLE_DEFAULT_PER_PAGE,
  ROLE_DEFAULT_SORT,
} from '../constant/acl-role.constant';

import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@/utils/pagination';

export class AclRoleListDto implements IPaginationList {
  @PaginationSearch()
  @ApiProperty()
  readonly search: string;

  @PaginationAvailableSearch(ROLE_DEFAULT_AVAILABLE_SEARCH)
  @ApiProperty()
  readonly availableSearch: string[];

  @PaginationPage(ROLE_DEFAULT_PAGE)
  @ApiProperty()
  readonly page: number;

  @PaginationPerPage(ROLE_DEFAULT_PER_PAGE)
  @ApiProperty()
  readonly perPage: number;

  @PaginationSort(ROLE_DEFAULT_SORT, ROLE_DEFAULT_AVAILABLE_SORT)
  @ApiProperty()
  readonly sort: IPaginationSort;

  @PaginationAvailableSort(ROLE_DEFAULT_AVAILABLE_SORT)
  @ApiProperty()
  readonly availableSort: string[];
}
