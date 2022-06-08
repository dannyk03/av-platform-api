import {
  PERMISSIONS_BY_GROUP,
  ENUM_PERMISSION_GROUPS,
} from '@/permission/permission.constant';

const ROLES = {
  SUPER_ADMIN: 'super-admin',
  OWNER: 'owner',
  ADMIN: 'admin',
  MANAGER: 'manager',
};

const enum ACTIONS {
  read,
  create,
  update,
  delete,
  manage,
}

const ROLES_AND_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: PERMISSIONS_BY_GROUP[ENUM_PERMISSION_GROUPS.SYSTEM],
};

// ROLES_AND_PERMISSIONS[ROLES.SUPER_ADMIN]; =

export const ROLE_DEFAULT_SORT = 'name@asc';
export const ROLE_DEFAULT_PAGE = 1;
export const ROLE_DEFAULT_PER_PAGE = 10;
export const ROLE_DEFAULT_AVAILABLE_SORT = ['name', 'createdAt'];
export const ROLE_DEFAULT_AVAILABLE_SEARCH = ['name'];

export enum ENUM_ROLE_STATUS_CODE_ERROR {
  ROLE_IS_INACTIVE_ERROR = 5500,
  ROLE_NOT_FOUND_ERROR = 5501,
  ROLE_EXIST_ERROR = 5502,
  ROLE_ACTIVE_ERROR = 5503,
  ROLE_USED_ERROR = 5504,
}

export const ROLE_ACTIVE_META_KEY = 'RoleActiveMetaKey';
