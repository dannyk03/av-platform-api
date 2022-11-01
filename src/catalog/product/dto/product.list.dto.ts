import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import {
  EnumDisplayLanguage,
  IPaginationList,
  IPaginationSort,
} from '@avo/type';

import { IsOptional } from 'class-validator';

import { ProductDisplayLanguage } from '../product.decorator';

import {
  PRODUCT_DEFAULT_ACTIVE,
  PRODUCT_DEFAULT_AVAILABLE_SEARCH,
  PRODUCT_DEFAULT_AVAILABLE_SORT,
  PRODUCT_DEFAULT_PAGE,
  PRODUCT_DEFAULT_PER_PAGE,
  PRODUCT_DEFAULT_SORT,
  ProductOrderByNestingAliasMap,
} from '../product.constant';

import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationFilterBoolean,
  PaginationFilterRange,
  PaginationMultiSearch,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from '@/utils/pagination';

export class ProductListDto implements IPaginationList {
  @ProductDisplayLanguage()
  readonly lang: EnumDisplayLanguage;

  @PaginationSearch()
  readonly search: string;

  @PaginationMultiSearch()
  readonly keywords: string[];

  @ApiHideProperty()
  @PaginationAvailableSearch(PRODUCT_DEFAULT_AVAILABLE_SEARCH)
  readonly availableSearch: string[];

  @PaginationPage(PRODUCT_DEFAULT_PAGE)
  readonly page: number;

  @PaginationPerPage(PRODUCT_DEFAULT_PER_PAGE)
  readonly perPage: number;

  @PaginationSort(
    PRODUCT_DEFAULT_SORT,
    PRODUCT_DEFAULT_AVAILABLE_SORT,
    ProductOrderByNestingAliasMap,
  )
  readonly sort: IPaginationSort;

  @ApiHideProperty()
  @PaginationAvailableSort(PRODUCT_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];

  @PaginationFilterBoolean(PRODUCT_DEFAULT_ACTIVE)
  readonly isActive: boolean[];

  @IsOptional()
  @PaginationFilterRange()
  readonly priceRange?: [number, number];
}
