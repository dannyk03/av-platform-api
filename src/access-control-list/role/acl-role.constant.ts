export enum EnumSystemRole {
  SystemAdmin = 'System Admin',
  SystemManager = 'System Manager',
  SystemObserver = 'System Observer',
}

export enum EnumOrganizationRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Manager = 'Manager',
  User = 'User',
  Observer = 'Observer',
}

export enum EnumRoleStatusCodeError {
  RoleNotFoundError = 5500,
  RoleExistsError = 5501,
  RoleActiveError = 5502,
  RoleUsedError = 5503,
}

export const ROLE_DEFAULT_SORT = 'name@asc';
export const ROLE_DEFAULT_PAGE = 1;
export const ROLE_DEFAULT_PER_PAGE = 10;
export const ROLE_DEFAULT_AVAILABLE_SORT = ['name', 'createdAt'];
export const ROLE_DEFAULT_AVAILABLE_SEARCH = ['name'];

// export const ROLE_ACTIVE_META_KEY = 'RoleActiveMetaKey';
