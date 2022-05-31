export const ROLE_DEFAULT_SORT = 'name@asc';
export const ROLE_DEFAULT_PAGE = 1;
export const ROLE_DEFAULT_PER_PAGE = 10;
export const ROLE_DEFAULT_AVAILABLE_SORT = ['name', 'createdAt'];
export const ROLE_DEFAULT_AVAILABLE_SEARCH = ['name'];

export enum RoleStatusCodeError {
    RoleIsInactiveError = 5500,
    RoleNotFoundError = 5501,
    RoleExistError = 5502,
    RoleActiveError = 5503,
    RoleUsedError = 5504,
}

export const ROLE_ACTIVE_META_KEY = 'RoleActiveMetaKey';
