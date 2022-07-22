export const PAGINATION_DEFAULT_PER_PAGE = 10;
export const PAGINATION_DEFAULT_MAX_PER_PAGE = 100;
export const PAGINATION_DEFAULT_PAGE = 1;
export const PAGINATION_DEFAULT_MAX_PAGE = 20;
export const PAGINATION_DEFAULT_SORT = 'createdAt@asc';
export const PAGINATION_DEFAULT_AVAILABLE_SORT = ['createdAt'];

export enum EnumPaginationAvailableSortType {
  Asc = 'ASC',
  Desc = 'DESC',
}

export enum EnumPaginationType {
  Full = 'Full',
  Simple = 'Simple',
  Mini = 'Mini',
}
