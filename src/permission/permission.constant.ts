export enum ENUM_PERMISSIONS {
  USER_CREATE = 'user-create',
  USER_UPDATE = 'user-update',
  USER_READ = 'user-read',
  USER_DELETE = 'user-delete',

  ROLE_CREATE = 'role-create',
  ROLE_UPDATE = 'role-update',
  ROLE_READ = 'role-read',
  ROLE_DELETE = 'role-delete',
  // ROLE_MANAGE = 'role-manage',
  // ROLE_MANAGE1 = 'role-manage1',
  // ROLE_MANAGE2 = 'role Manage2',

  ORGANIZATION_CREATE = 'organization-create',
  ORGANIZATION_UPDATE = 'organization-update',
  ORGANIZATION_READ = 'organization-read',
  ORGANIZATION_DELETE = 'organization-delete',

  PERMISSION_READ = 'permission-read',
  PERMISSION_UPDATE = 'permission-update',

  PAYMENT_CREATE = 'payment-create',
  PAYMENT_UPDATE = 'payment-update',
  PAYMENT_READ = 'payment-read',
  PAYMENT_DELETE = 'payment-delete',

  SETTING_READ = 'setting-read',
  SETTING_UPDATE = 'setting-update',
}

export const PERMISSION_META_KEY = 'PermissionMetaKey';

export const PERMISSION_ACTIVE_META_KEY = 'PermissionActiveMetaKey';

export enum ENUM_PERMISSION_STATUS_CODE_ERROR {
  PERMISSION_NOT_FOUND_ERROR = 5200,
  PERMISSION_GUARD_INVALID_ERROR = 5201,
  PERMISSION_ACTIVE_ERROR = 5203,
}

export const PERMISSION_DEFAULT_SORT = 'name@asc';
export const PERMISSION_DEFAULT_PAGE = 1;
export const PERMISSION_DEFAULT_PER_PAGE = 10;
export const PERMISSION_DEFAULT_AVAILABLE_SORT = ['code', 'name', 'createdAt'];
export const PERMISSION_DEFAULT_AVAILABLE_SEARCH = ['code', 'name'];
export const PERMISSION_DEFAULT_ACTIVE = [true, false];
