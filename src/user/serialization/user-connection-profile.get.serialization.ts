import { IUserProfileGetSerialization } from '@avo/type';

import { Exclude, Expose, Transform } from 'class-transformer';

import { IAwsS3 } from '@/aws/type';

import { UserProfileGetSerialization } from './user-profile.get.serialization';

@Exclude()
export class UserConnectionProfileGetSerialization extends UserProfileGetSerialization {
  @Exclude()
  readonly isActive: boolean;
}
