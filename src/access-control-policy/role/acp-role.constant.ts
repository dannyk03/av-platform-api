export enum SystemRoleEnum {
  SuperAdmin = 'Super Admin',
  SystemAdmin = 'System Admin',
  SystemManager = 'System Manager',
  SystemReadOnly = 'System Read Only',
}

export enum RoleEnum {
  Owner = 'Owner',
  Admin = 'Admin',
  Manager = 'Manager',
  ReadOnly = 'Read Only',
}

export enum ENUM_ROLE_STATUS_CODE_ERROR {
  ROLE_IS_INACTIVE_ERROR = 5500,
  ROLE_NOT_FOUND_ERROR = 5501,
  ROLE_EXIST_ERROR = 5502,
  ROLE_ACTIVE_ERROR = 5503,
  ROLE_USED_ERROR = 5504,
}

export const ROLE_ACTIVE_META_KEY = 'RoleActiveMetaKey';
