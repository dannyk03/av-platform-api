import { Injectable } from '@nestjs/common';

import {
  PAGINATION_DEFAULT_MAX_PAGE,
  PAGINATION_DEFAULT_MAX_PER_PAGE,
} from '../pagination.constant';

@Injectable()
export class PaginationService {
  async skip(page: number, perPage: number): Promise<number> {
    page = Math.min(PAGINATION_DEFAULT_MAX_PAGE, page);
    perPage = Math.min(PAGINATION_DEFAULT_MAX_PER_PAGE, page);
    const skip: number = (page - 1) * perPage;

    return skip;
  }

  async totalPage(totalData: number, limit: number): Promise<number> {
    return Math.ceil(totalData / limit);
  }
}
