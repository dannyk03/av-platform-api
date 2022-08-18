export const CONNECT_REQUEST_DEFAULT_PAGE = 1;
export const CONNECT_REQUEST_DEFAULT_PER_PAGE = 10;
export const CONNECT_REQUEST_DEFAULT_SORT = 'createdAt@asc';

export const CONNECT_REQUEST_DEFAULT_AVAILABLE_SORT = ['from', 'createdAt'];
export const CONNECT_REQUEST_DEFAULT_AVAILABLE_SEARCH = ['from'];

export const ConnectRequestOrderByNestingAliasMap = {
  createdAt: 'socialConnectionRequest.createdAt',
  from: 'socialConnectionRequest.addressedUser.email',
};

//

export const CONNECTS_DEFAULT_PAGE = 1;
export const CONNECTS_DEFAULT_PER_PAGE = 10;
export const CONNECTS_DEFAULT_SORT = 'createdAt@asc';

export const CONNECTS_DEFAULT_AVAILABLE_SORT = ['from', 'createdAt'];
export const CONNECTS_DEFAULT_AVAILABLE_SEARCH = ['from'];

export const ConnectionsOrderByNestingAliasMap = {
  createdAt: 'socialConnectionRequest.createdAt',
  from: 'socialConnectionRequest.addressedUser.email',
};
