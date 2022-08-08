import { IPaginationOptions } from '@/utils/pagination/pagination.interface';

export interface IGiftIntentSearch {
  search?: string;
  loadExtra?: boolean;
  options?: IPaginationOptions;
}
