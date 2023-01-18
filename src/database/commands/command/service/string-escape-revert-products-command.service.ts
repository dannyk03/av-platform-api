import { Injectable } from '@nestjs/common';

import { buildPaginator } from 'typeorm-cursor-pagination';

import { Product } from '@/catalog/product/entity';

import { ProductService } from '@/catalog/product/service';

import { unescapeString } from '../utils';

@Injectable()
export class StringEscapeRevertProductsCommandService {
  constructor(private readonly productService: ProductService) {}

  async run(): Promise<void> {
    const queryBuilder = await this.productService.getAllProductsQueryBuilder();
    let afterCursor = null;
    do {
      const paginator = buildPaginator({
        entity: Product,
        query: {
          limit: 50,
          afterCursor,
        },
      });

      // Pass queryBuilder as parameter to get paginate result.
      const { data, cursor } = await paginator.paginate(queryBuilder);
      const newData = data.map((product: Product) => {
        return {
          ...product,
          brand: unescapeString(product.brand),
          sku: unescapeString(product.sku),
          taxCode: unescapeString(product.taxCode),
          vendorName: unescapeString(product.vendorName),
          displayOptions: product.displayOptions.map((displayOption) => {
            return {
              ...displayOption,
              name: unescapeString(displayOption.name),
              description: unescapeString(displayOption.description),
            };
          }),
        };
      });
      await this.productService.saveBulk(newData);
      afterCursor = cursor.afterCursor;
    } while (afterCursor);
  }
}
