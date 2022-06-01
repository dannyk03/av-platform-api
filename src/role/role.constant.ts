import { Permissions } from '@/permission';

export const ROLE_DEFAULT_SORT = 'name@asc';
export const ROLE_DEFAULT_PAGE = 1;
export const ROLE_DEFAULT_PER_PAGE = 10;
export const ROLE_DEFAULT_AVAILABLE_SORT = ['name', 'createdAt'];
export const ROLE_DEFAULT_AVAILABLE_SEARCH = ['name'];

export enum RoleStatusCodeError {
    RoleIsInactiveError = 5500,
    RoleNotFoundError = 5501,
    RoleExistError = 5502,
    RoleActiveError = 5503,
    RoleUsedError = 5504,
}

export const ROLE_ACTIVE_META_KEY = 'RoleActiveMetaKey';

export enum Roles {
    SuperAdmin = 'SUPER_ADMIN',
    Owner = 'OWNER',
    Admin = 'ADMIN',
    Manager = 'MANAGER',
    User = 'USER',
}

// TODO Think of a more sophisticated way to define roles and permissions
const RolesAndPermissions = {};
RolesAndPermissions[Roles.SuperAdmin] = Object.values(Permissions);
RolesAndPermissions[Roles.Owner] = RolesAndPermissions[Roles.SuperAdmin].filter(
    (permission) => !permission.startsWith('SETTINGS'),
);
RolesAndPermissions[Roles.Admin] = RolesAndPermissions[Roles.SuperAdmin].filter(
    (permission) =>
        !permission.startsWith('ORGANIZATION') &&
        !permission.startsWith('ROLE') &&
        !permission.startsWith('PERMISSION'),
);
RolesAndPermissions[Roles.Manager] = RolesAndPermissions[Roles.Admin].filter(
    (permission) => !permission.startsWith('PAYMENT'),
);
RolesAndPermissions[Roles.User] = [];

export { RolesAndPermissions };
