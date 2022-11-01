import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

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

  @ApiHideProperty()
  @PaginationAvailableSearch(ROLE_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(ROLE_DEFAULT_PAGE)
  @ApiProperty({ default: ROLE_DEFAULT_PAGE })
  readonly page: number;

  @PaginationPerPage(ROLE_DEFAULT_PER_PAGE)
  @ApiProperty({ default: ROLE_DEFAULT_PER_PAGE })
  readonly perPage: number;

  @PaginationSort(ROLE_DEFAULT_SORT, ROLE_DEFAULT_AVAILABLE_SORT)
  readonly sort: IPaginationSort;

  @ApiHideProperty()
  @PaginationAvailableSort(ROLE_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];
}
