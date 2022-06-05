import { IPaginationOptions } from 'src/utils/pagination/pagination.interface';

export interface IDatabaseFindOneOptions {
  where?: Record<string, boolean>;
}

export interface IDatabaseFindAllOptions
  extends IPaginationOptions,
    IDatabaseFindOneOptions {}
