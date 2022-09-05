import { Exclude } from 'class-transformer';

import { UserProfileGetSerialization } from './user-profile.get.serialization';

@Exclude()
export class UserConnectionProfileGetSerialization extends UserProfileGetSerialization {
  @Exclude()
  readonly isActive: boolean;
}
