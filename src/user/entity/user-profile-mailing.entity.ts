import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { Address } from './user-profile-address.abstract.entity';
import { UserProfile } from './user-profile.entity';

@Entity()
export class UserProfileMailing extends Address {
  @Column({
    length: 1000,
    nullable: true,
  })
  deliveryInstructions?: string;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.mailing, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userProfile: UserProfile;
}
