// Group Invites
export const GROUP_INVITE_DEFAULT_PAGE = 1;
export const GROUP_INVITE_DEFAULT_PER_PAGE = 10;
export const GROUP_INVITE_DEFAULT_SORT = 'createdAt@asc';

export const GROUP_INVITE_DEFAULT_AVAILABLE_SORT = ['createdAt'];
export const GROUP_INVITE_DEFAULT_AVAILABLE_SEARCH = ['status'];

export const GroupInviteOrderByNestingAliasMap = {
  createdAt: 'groupInviteMember.createdAt',
};
