export const USER_DEFAULT_PAGE = 1;
export const USER_DEFAULT_PER_PAGE = 10;
export const USER_DEFAULT_SORT = 'createdAt@asc';
export const USER_DEFAULT_ACTIVE = [true, false];
export const USER_DEFAULT_AVAILABLE_SORT = [
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
  'organization',
  'role',
  'createdAt',
];
export const USER_DEFAULT_AVAILABLE_SEARCH = [
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
];

export const UserOrderByNestingAliasMap = {
  firstName: 'profile.firstName',
  lastName: 'profile.lastName',
  email: 'user.email',
  phoneNumber: 'user.phoneNumber',
  organization: 'organization.name',
  role: 'role.name',
  createdAt: 'user.createdAt',
};

export const USER_VERIFIED_ONLY_META_KEY = 'UserVerifiedOnlyMetaKey';
export const USER_RELATIONS_META_KEY = 'UserRelationsMetaKey';
export const USER_LOAD_AUTH_SENSITIVE_DATA_META_KEY =
  'UserLoadAuthSensitiveDataMetaKey';
