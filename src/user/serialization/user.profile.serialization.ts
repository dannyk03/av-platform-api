import { Exclude } from 'class-transformer';
import { IAwsS3Response } from '@/aws/aws.interface';
import { UserAuthConfig } from '@/auth/entity';
// import { IRoleEntity } from '@/role/role.interface';

export class UserProfileSerialization {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly photo?: IAwsS3Response;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  @Exclude()
  authConfig: UserAuthConfig;

  @Exclude()
  readonly deletedAt: Date;
}
