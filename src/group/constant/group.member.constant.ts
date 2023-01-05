export const GROUP_MEMBER_DEFAULT_PAGE = 1;
export const GROUP_MEMBER_DEFAULT_PER_PAGE = 10;
export const GROUP_MEMBER_DEFAULT_MEMBER_PREVIEW_COUNT = 5;
export const GROUP_MEMBER_DEFAULT_SORT = 'createdAt@asc';
export const GROUP_MEMBER_DEFAULT_ACTIVE = [true];
export const GROUP_MEMBER_DEFAULT_AVAILABLE_SORT = ['firstName', 'lastName'];
export const GROUP_MEMBER_DEFAULT_AVAILABLE_SEARCH = [];

export const GroupMemberOrderByNestingAliasMap = {
  firstName: 'userProfile.firstName',
  lastName: 'userProfile.lastName',
  createdAt: 'memberUser.createdAt',
};
