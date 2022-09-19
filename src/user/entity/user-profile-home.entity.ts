import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { UserProfile } from './user-profile.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class UserProfileHome extends BaseEntity<UserProfileHome> {
  @Column({
    length: 70,
    nullable: true,
  })
  city?: string;

  @Column({
    length: 70,
    nullable: true,
  })
  state?: string;

  @Column({
    length: 70,
    nullable: true,
  })
  country?: string;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.home, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userProfile: UserProfile;
}
