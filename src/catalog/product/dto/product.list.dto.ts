import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty()
  readonly lang: EnumDisplayLanguage;

  @PaginationSearch()
  @ApiProperty()
  readonly search: string;

  @PaginationMultiSearch()
  @ApiProperty()
  readonly keywords: string[];

  @PaginationAvailableSearch(PRODUCT_DEFAULT_AVAILABLE_SEARCH)
  @ApiProperty({ default: PRODUCT_DEFAULT_AVAILABLE_SEARCH })
  readonly availableSearch: string[];

  @PaginationPage(PRODUCT_DEFAULT_PAGE)
  @ApiProperty({ default: PRODUCT_DEFAULT_PAGE })
  readonly page: number;

  @PaginationPerPage(PRODUCT_DEFAULT_PER_PAGE)
  @ApiProperty({ default: PRODUCT_DEFAULT_PER_PAGE })
  readonly perPage: number;

  @PaginationSort(
    PRODUCT_DEFAULT_SORT,
    PRODUCT_DEFAULT_AVAILABLE_SORT,
    ProductOrderByNestingAliasMap,
  )
  @ApiProperty()
  readonly sort: IPaginationSort;

  @PaginationAvailableSort(PRODUCT_DEFAULT_AVAILABLE_SORT)
  @ApiProperty({ default: PRODUCT_DEFAULT_AVAILABLE_SORT })
  readonly availableSort: string[];

  @PaginationFilterBoolean(PRODUCT_DEFAULT_ACTIVE)
  @ApiProperty({ default: PRODUCT_DEFAULT_ACTIVE })
  readonly isActive: boolean[];

  @IsOptional()
  @PaginationFilterRange()
  @ApiProperty({ required: false })
  readonly priceRange?: [number, number];
}
