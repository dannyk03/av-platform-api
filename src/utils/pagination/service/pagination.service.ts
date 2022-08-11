import { Injectable } from '@nestjs/common';

import { PAGINATION_DEFAULT_MAX_PER_PAGE } from '../pagination.constant';

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
}
