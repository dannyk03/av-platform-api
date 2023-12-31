import { IPaginationOptions } from '@/utils/pagination';

export interface IUserCreate {
  firstName: string;
  lastName?: string;
  password: string;
  passwordExpired: Date;
  email: string;
  phoneNumber: string;
  salt: string;
  isActive?: boolean;
}

export type IUserUpdate = Pick<IUserCreate, 'firstName' | 'lastName'>;

export interface IUserCheckExist {
  email: boolean;
  phoneNumber: boolean;
}

export interface IUserSearch {
  search?: string;
  options?: IPaginationOptions;
  isActive?: boolean[];
}
