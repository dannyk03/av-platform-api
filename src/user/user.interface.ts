import { IRoleEntity } from 'src/role/role.interface';
import { User } from './entity/user.entity';

export interface IUserEntity extends Omit<User, 'role'> {
  role: IRoleEntity;
}

export interface IUserCreate {
  firstName: string;
  lastName?: string;
  password: string;
  passwordExpired: Date;
  email: string;
  mobileNumber: string;
  role: string;
  salt: string;
}

export type IUserUpdate = Pick<IUserCreate, 'firstName' | 'lastName'>;

export interface IUserCheckExist {
  email: boolean;
  mobileNumber: boolean;
}
