export const BASIC_ROLE_NAME = 'Basic';

export enum EnumSystemRole {
  SystemAdmin = 'System Admin',
  SystemManager = 'System Manager',
  SystemObserver = 'System Observer',
  Basic = 'Basic',
}

export enum EnumOrganizationRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Manager = 'Manager',
  Observer = 'Observer',
  Basic = 'Basic',
}

export const ROLE_DEFAULT_SORT = 'name@asc';
export const ROLE_DEFAULT_PAGE = 1;
export const ROLE_DEFAULT_PER_PAGE = 10;
export const ROLE_DEFAULT_AVAILABLE_SORT = ['name', 'createdAt'];
export const ROLE_DEFAULT_AVAILABLE_SEARCH = ['name'];
