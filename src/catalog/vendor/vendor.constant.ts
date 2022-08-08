export const VENDOR_DEFAULT_PAGE = 1;
export const VENDOR_DEFAULT_PER_PAGE = 10;
export const VENDOR_DEFAULT_SORT = 'createdAt@asc';
export const VENDOR_DEFAULT_ACTIVE = [true, false];
export const VENDOR_DEFAULT_AVAILABLE_SORT = ['name', 'createdAt'];
export const VENDOR_DEFAULT_AVAILABLE_SEARCH = ['name', 'description'];

export const VendorOrderByNestingAliasMap = {
  name: 'vendor.name',
  createdAt: 'vendor.createdAt',
};
