import { EnumPaginationType } from '../pagination';

export type IResponse = Record<string, any>;

export interface IResponsePaging {
  totalData: number;
  totalPage?: number;
  currentPage?: number;
  perPage?: number;
  availableSearch?: string[];
  availableSort?: string[];
  metadata?: Record<string, any>;
  data: Record<string, any>[];
}

export interface IResponsePagingOptions {
  statusCode?: number;
  type?: EnumPaginationType;
}
