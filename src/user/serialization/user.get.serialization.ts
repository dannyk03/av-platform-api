import { Exclude, Transform, Type } from 'class-transformer';
import { IAwsS3Response } from '@/aws/aws.interface';
// import { IRoleEntity } from '@/role/role.interface';

export class UserGetSerialization {
  readonly id: string;

  readonly email: string;
  readonly phoneNumber: string;
  readonly isActive: boolean;
  readonly firstName: string;
  readonly lastName: string;
  readonly photo?: IAwsS3Response;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;
}
