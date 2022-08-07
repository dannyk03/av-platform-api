import { IPaginationSort } from '@/utils/pagination/pagination.interface';

import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@/utils/pagination';
import { IPaginationList } from '@/utils/pagination';

import {
  USER_DEFAULT_AVAILABLE_SEARCH,
  USER_DEFAULT_AVAILABLE_SORT,
  USER_DEFAULT_PAGE,
  USER_DEFAULT_PER_PAGE,
  USER_DEFAULT_SORT,
} from '../user.constant';

export class UserListDto implements IPaginationList {
  @PaginationSearch()
  readonly search: string;

  @PaginationAvailableSearch(USER_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(USER_DEFAULT_PAGE)
  readonly page: number;

  @PaginationPerPage(USER_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @PaginationSort(USER_DEFAULT_SORT, USER_DEFAULT_AVAILABLE_SORT)
  readonly sort: IPaginationSort;

  @PaginationAvailableSort(USER_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];
}
