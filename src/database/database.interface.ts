import { IPaginationOptions } from 'src/utils/pagination/pagination.interface';

export interface IDatabaseFindOneOptions<T> {
  where?: Record<keyof T, any>;
}

export interface IDatabaseFindAllOptions<T = any>
  extends IPaginationOptions,
    IDatabaseFindOneOptions<T> {}
