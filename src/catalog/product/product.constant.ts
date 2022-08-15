export const PRODUCT_DEFAULT_PAGE = 1;
export const PRODUCT_DEFAULT_PER_PAGE = 10;
export const PRODUCT_DEFAULT_SORT = 'createdAt@asc';
export const PRODUCT_DEFAULT_ACTIVE = [true, false];
export const PRODUCT_DEFAULT_AVAILABLE_SORT = [
  'sku',
  'brand',
  'name',
  'price',
  'description',
  'keywords',
  'vendor',
  'createdAt',
];
export const PRODUCT_DEFAULT_AVAILABLE_SEARCH = [
  'sku',
  'brand',
  'name',
  'description',
  'keywords',
];

export const ProductOrderByNestingAliasMap = {
  name: 'displayOptions.name',
  description: 'displayOptions.description',
  sku: 'product.sku',
  brand: 'product.brand',
  createdAt: 'product.createdAt',
  keywords: 'keywords_special_logic',
  price: 'product.price',
  vendor: 'product.vendorName',
};
