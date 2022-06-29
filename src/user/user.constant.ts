export enum EnumUserStatusCodeError {
  UserNotFoundError = 5400,
  UserExistsError = 5401,
  UserInactiveError = 5402,
  UserEmailExistError = 5403,
  UserMobileNumberExistError = 5404,
  UserAlreadyInvited = 5405,
}

export const USER_DEFAULT_PAGE = 1;
export const USER_DEFAULT_PER_PAGE = 10;
export const USER_DEFAULT_SORT = 'name@asc';
export const USER_DEFAULT_AVAILABLE_SORT = [
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
  'createdAt',
];
export const USER_DEFAULT_AVAILABLE_SEARCH = [
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
];
