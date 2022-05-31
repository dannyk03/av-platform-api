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
    ORGANIZATION_DEFAULT_AVAILABLE_SEARCH,
    ORGANIZATION_DEFAULT_AVAILABLE_SORT,
    ORGANIZATION_DEFAULT_PAGE,
    ORGANIZATION_DEFAULT_PER_PAGE,
    ORGANIZATION_DEFAULT_SORT,
} from '../organization.constant';

export class OrganizationListDto implements PaginationListAbstract {
    @PaginationSearch()
    readonly search: string;

    @PaginationAvailableSearch(ORGANIZATION_DEFAULT_AVAILABLE_SEARCH)
    readonly availableSearch: string[];

    @PaginationPage(ORGANIZATION_DEFAULT_PAGE)
    readonly page: number;

    @PaginationPerPage(ORGANIZATION_DEFAULT_PER_PAGE)
    readonly perPage: number;

    @PaginationSort(
        ORGANIZATION_DEFAULT_SORT,
        ORGANIZATION_DEFAULT_AVAILABLE_SORT,
    )
    readonly sort: IPaginationSort;

    @PaginationAvailableSort(ORGANIZATION_DEFAULT_AVAILABLE_SORT)
    readonly availableSort: string[];
}
