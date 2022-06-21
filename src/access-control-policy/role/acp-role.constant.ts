export enum EnumSystemRole {
  SuperAdmin = 'Super Admin',
  SystemAdmin = 'System Admin',
  SystemManager = 'System Manager',
  SystemReadOnly = 'System Read Only',
}

export enum EnumRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Manager = 'Manager',
  ReadOnly = 'Read Only',
}

export enum EnumRoleStatusCodeError {
  RoleIsInactiveError = 5500,
  RoleNotFoundError = 5501,
  RoleExistsError = 5502,
  RoleActiveError = 5503,
  RoleUsedError = 5504,
}

export const ROLE_ACTIVE_META_KEY = 'RoleActiveMetaKey';
