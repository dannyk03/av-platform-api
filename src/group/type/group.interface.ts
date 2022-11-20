import { IPaginationOptions } from '@/utils/pagination';

export interface IGroupSearch {
  userId: string;
  search?: string;
  isActive?: boolean[];
  options?: IPaginationOptions;
}
