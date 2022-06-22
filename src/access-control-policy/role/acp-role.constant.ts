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
  RoleIsInactiveError = 5500,
  RoleNotFoundError = 5501,
  RoleExistsError = 5502,
  RoleActiveError = 5503,
  RoleUsedError = 5504,
}

export const ROLE_ACTIVE_META_KEY = 'RoleActiveMetaKey';
