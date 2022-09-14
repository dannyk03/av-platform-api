// Connection Request
export const CONNECT_REQUEST_DEFAULT_PAGE = 1;
export const CONNECT_REQUEST_DEFAULT_PER_PAGE = 10;
export const CONNECT_REQUEST_DEFAULT_SORT = 'createdAt@asc';

export const CONNECT_REQUEST_DEFAULT_AVAILABLE_SORT = ['from', 'createdAt'];
export const CONNECT_REQUEST_DEFAULT_AVAILABLE_SEARCH = ['from'];

export const ConnectRequestOrderByNestingAliasMap = {
  createdAt: 'socialConnectionRequest.createdAt',
  from: 'socialConnectionRequest.addresserUser.email',
};

// Connection
export const CONNECTIONS_DEFAULT_PAGE = 1;
export const CONNECTIONS_DEFAULT_PER_PAGE = 10;
export const CONNECTIONS_DEFAULT_SORT = 'createdAt@asc';

export const CONNECTIONS_DEFAULT_AVAILABLE_SORT = ['email', 'createdAt'];
export const CONNECTIONS_DEFAULT_AVAILABLE_SEARCH = ['email'];

export const ConnectionsOrderByNestingAliasMap = {
  createdAt: 'socialConnection.createdAt',
  email: 'socialConnection.addresserUser.email',
};
