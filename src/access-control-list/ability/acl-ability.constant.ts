export const ABILITY_META_KEY = 'AbilityMetaKey';

export const PERMISSION_ACTIVE_META_KEY = 'PermissionActiveMetaKey';

export enum PermissionsStatusCodeError {
  Forbidden = 5200,
  NotFoundError = 5201,
  GuardInvalidError = 5202,
  ActiveError = 5203,
}

export const PERMISSION_DEFAULT_SORT = 'name@asc';
export const PERMISSION_DEFAULT_PAGE = 1;
export const PERMISSION_DEFAULT_PER_PAGE = 10;
export const PERMISSION_DEFAULT_AVAILABLE_SORT = ['code', 'name', 'createdAt'];
export const PERMISSION_DEFAULT_AVAILABLE_SEARCH = ['code', 'name'];
export const PERMISSION_DEFAULT_ACTIVE = [true, false];
