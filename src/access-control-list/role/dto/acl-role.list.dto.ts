import {
  PaginationListAbstract,
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
  IPaginationSort,
} from '@/utils/pagination';
import {
  ROLE_DEFAULT_AVAILABLE_SEARCH,
  ROLE_DEFAULT_AVAILABLE_SORT,
  ROLE_DEFAULT_PAGE,
  ROLE_DEFAULT_PER_PAGE,
  ROLE_DEFAULT_SORT,
} from '../acl-role.constant';

export class AclRoleListDto implements PaginationListAbstract {
  @PaginationSearch(ROLE_DEFAULT_AVAILABLE_SEARCH)
  readonly search: string;

  @PaginationAvailableSearch(ROLE_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(ROLE_DEFAULT_PAGE)
  readonly page: number;

  @PaginationPerPage(ROLE_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @PaginationSort(ROLE_DEFAULT_SORT, ROLE_DEFAULT_AVAILABLE_SORT)
  readonly sort: IPaginationSort;

  @PaginationAvailableSort(ROLE_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];
}
