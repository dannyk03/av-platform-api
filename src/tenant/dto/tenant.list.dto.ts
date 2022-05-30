import { PaginationListAbstract } from '@/utils/pagination/pagination.abstract';
import {
    PaginationAvailableSearch,
    PaginationAvailableSort,
    PaginationPage,
    PaginationPerPage,
    PaginationSearch,
    PaginationSort,
} from '@/utils/pagination/pagination.decorator';
import { IPaginationSort } from '@/utils/pagination/pagination.interface';
import {
    TENANT_DEFAULT_AVAILABLE_SEARCH,
    TENANT_DEFAULT_AVAILABLE_SORT,
    TENANT_DEFAULT_PAGE,
    TENANT_DEFAULT_PER_PAGE,
    TENANT_DEFAULT_SORT,
} from '../tenant.constant';

export class TenantListDto implements PaginationListAbstract {
    @PaginationSearch()
    readonly search: string;

    @PaginationAvailableSearch(TENANT_DEFAULT_AVAILABLE_SEARCH)
    readonly availableSearch: string[];

    @PaginationPage(TENANT_DEFAULT_PAGE)
    readonly page: number;

    @PaginationPerPage(TENANT_DEFAULT_PER_PAGE)
    readonly perPage: number;

    @PaginationSort(TENANT_DEFAULT_SORT, TENANT_DEFAULT_AVAILABLE_SORT)
    readonly sort: IPaginationSort;

    @PaginationAvailableSort(TENANT_DEFAULT_AVAILABLE_SORT)
    readonly availableSort: string[];
}
