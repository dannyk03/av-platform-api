export enum Permissions {
    UserCreate = 'USER_CREATE',
    UserUpdate = 'USER_UPDATE',
    UserRead = 'USER_READ',
    UsedDelete = 'USER_DELETE',
    RoleCreate = 'ROLE_CREATE',
    RoleUpdate = 'ROLE_UPDATE',
    RoleRead = 'ROLE_READ',
    RoleDelete = 'ROLE_DELETE',
    PermissionsRead = 'PERMISSION_READ',
    PermissionsUpdate = 'PERMISSION_UPDATE',
    SettingsRead = 'SETTING_READ',
    SettingsUpdate = 'SETTING_UPDATE',
    OrganizationCreate = 'ORGANIZATION_CREATE',
    OrganizationRead = 'ORGANIZATION_READ',
    OrganizationUpdate = 'ORGANIZATION_UPDATE',
    OrganizationDelete = 'ORGANIZATION_DELETE',
}

export const PERMISSION_META_KEY = 'PermissionMetaKey';

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
