export const GROUP_DEFAULT_PAGE = 1;
export const GROUP_DEFAULT_PER_PAGE = 10;
export const GROUP_DEFAULT_MEMBER_PREVIEW_COUNT = 5;
export const GROUP_DEFAULT_SORT = 'createdAt@asc';
export const GROUP_DEFAULT_ACTIVE = [true];
export const GROUP_DEFAULT_AVAILABLE_SORT = ['name', 'createdAt'];
export const GROUP_DEFAULT_AVAILABLE_SEARCH = ['name', 'description'];

export const GroupOrderByNestingAliasMap = {
  name: 'group.name',
  description: 'group.description',
};
