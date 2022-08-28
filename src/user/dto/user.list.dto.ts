import { IPaginationList, IPaginationSort } from '@avo/type';

import {
  USER_DEFAULT_ACTIVE,
  USER_DEFAULT_AVAILABLE_SEARCH,
  USER_DEFAULT_AVAILABLE_SORT,
  USER_DEFAULT_PAGE,
  USER_DEFAULT_PER_PAGE,
  USER_DEFAULT_SORT,
  UserOrderByNestingAliasMap,
} from '../constant/user.constant';

import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationFilterBoolean,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@/utils/pagination';

export class UserListDto implements IPaginationList {
  @PaginationSearch()
  readonly search: string;

  @PaginationAvailableSearch(USER_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(USER_DEFAULT_PAGE)
  readonly page: number;

  @PaginationPerPage(USER_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @PaginationSort(
    USER_DEFAULT_SORT,
    USER_DEFAULT_AVAILABLE_SORT,
    UserOrderByNestingAliasMap,
  )
  readonly sort: IPaginationSort;

  @PaginationAvailableSort(USER_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];

  @PaginationFilterBoolean(USER_DEFAULT_ACTIVE)
  readonly isActive: boolean[];
}
