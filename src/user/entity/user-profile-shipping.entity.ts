import { Entity, JoinColumn, OneToOne } from 'typeorm';

import { Address } from './user-profile-address.abstract.entity';
import { UserProfile } from './user-profile.entity';

@Entity()
export class UserProfileShipping extends Address {
  @OneToOne(() => UserProfile, (userProfile) => userProfile.shipping, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userProfile: UserProfile;
}
