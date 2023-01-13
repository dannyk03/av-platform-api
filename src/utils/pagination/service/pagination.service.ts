import { Injectable } from '@nestjs/common';

import { isNumber } from 'class-validator';
import { SelectQueryBuilder } from 'typeorm';

import { PAGINATION_DEFAULT_MAX_PER_PAGE } from '../pagination.constant';

import { IPaginationOptions } from '@/utils/pagination';

@Injectable()
export class PaginationService {
  async skip(page: number, perPage: number): Promise<number> {
    perPage = Math.min(PAGINATION_DEFAULT_MAX_PER_PAGE, perPage);
    const skip: number = (page - 1) * perPage;

    return skip;
  }

  async totalPage(totalData: number, limit: number): Promise<number> {
    return Math.ceil(totalData / limit);
  }

  async getPaginatedData<T>({
    queryBuilder,
    options,
  }: {
    queryBuilder: SelectQueryBuilder<T>;
    options?: IPaginationOptions;
  }) {
    const totalData = await queryBuilder.clone().getCount();

    if (options.order) {
      queryBuilder.orderBy(options.order);
    }

    if (
      isNumber(options.take) &&
      (isNumber(options.page) || isNumber(options.skip))
    ) {
      const skip =
        options?.skip || (await this.skip(options.page, options.take));
      queryBuilder.take(options.take).skip(skip);
    }

    const data = await queryBuilder.getMany();

    const totalPage = await this.totalPage(totalData, options.take);

    return {
      data,
      totalData,
      totalPage,
    };
  }
}
