import { IPaginationOptions } from '@/utils/pagination/pagination.interface';
import { ClientSession } from 'mongoose';

export interface IDatabaseFindOneOptions {
    populate?: Record<string, boolean>;
}

export interface IDatabaseFindAllOptions
    extends IPaginationOptions,
        IDatabaseFindOneOptions {}

export interface IWithSession {
    session?: ClientSession | null;
}
