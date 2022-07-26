import { Exclude } from 'class-transformer';

import { UserAuthConfig } from '@/auth/entity';
import { IAwsS3Response } from '@/aws/aws.interface';

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
