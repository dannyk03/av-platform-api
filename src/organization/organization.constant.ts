export const ORGANIZATION_DEFAULT_SORT = 'name@asc';
export const ORGANIZATION_DEFAULT_PAGE = 1;
export const ORGANIZATION_DEFAULT_PER_PAGE = 10;
export const ORGANIZATION_DEFAULT_AVAILABLE_SORT = ['name', 'createdAt'];
export const ORGANIZATION_DEFAULT_AVAILABLE_SEARCH = ['name'];

export enum OrganizationStatusCodeError {
    OrganizationIsInactiveError = 5500,
    OrganizationNotFoundError = 5501,
    OrganizationExistError = 5502,
    OrganizationActiveError = 5503,
}

export const ORGANIZATION_ACTIVE_META_KEY = 'TenantActiveMetaKey';
