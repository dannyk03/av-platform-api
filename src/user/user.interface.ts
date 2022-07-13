import { User } from './entity';

// Todo check role
export type IUserEntity = Omit<User, 'role'>;

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
