export enum EnumProductStatusCodeError {
  ProductExistsError = 5700,
  ProductNotFoundError = 5701,
  ProductInactiveError = 5702,
  ProductActiveError = 5703,
}

export const PRODUCT_DEFAULT_PAGE = 1;
export const PRODUCT_DEFAULT_PER_PAGE = 10;
export const PRODUCT_DEFAULT_SORT = 'createdAt@asc';
export const PRODUCT_DEFAULT_ACTIVE = [true, false];
export const PRODUCT_DEFAULT_AVAILABLE_SORT = [
  'sku',
  'brand',
  'name',
  'description',
  'keywords',
  'createdAt',
];
export const PRODUCT_DEFAULT_AVAILABLE_SEARCH = [
  'sku',
  'brand',
  'name',
  'description',
  'keywords',
];

export const ProductNestingAliasMap = {
  name: 'displayOptions.name',
  description: 'displayOptions.description',
  createdAt: 'product.createdAt',
};
