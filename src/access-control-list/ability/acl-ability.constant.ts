export enum EnumAclAbilityAction {
  Manage = 'manage',
  Modify = 'modify',
  Create = 'create',
  Update = 'update',
  Read = 'read',
  Delete = 'delete',
}

export enum EnumAclAbilityType {
  Can = 'can',
  Cannot = 'cannot',
}

export const ABILITY_META_KEY = 'AbilityMetaKey';

export const PERMISSION_ACTIVE_META_KEY = 'PermissionActiveMetaKey';

export enum PermissionsStatusCodeError {
  NotFoundError = 5200,
  GuardInvalidError = 5201,
  ActiveError = 5203,
}

export const PERMISSION_DEFAULT_SORT = 'name@asc';
export const PERMISSION_DEFAULT_PAGE = 1;
export const PERMISSION_DEFAULT_PER_PAGE = 10;
export const PERMISSION_DEFAULT_AVAILABLE_SORT = ['code', 'name', 'createdAt'];
export const PERMISSION_DEFAULT_AVAILABLE_SEARCH = ['code', 'name'];
export const PERMISSION_DEFAULT_ACTIVE = [true, false];
