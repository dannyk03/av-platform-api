import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { UserProfile } from './user-profile.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class UserProfileShipping extends BaseEntity<UserProfileShipping> {
  @Column({
    length: 100,
    nullable: true,
  })
  addressLine1?: string;

  @Column({
    length: 100,
    nullable: true,
  })
  addressLine2?: string;

  @Column({
    length: 50,
    nullable: true,
  })
  city?: string;

  @Column({
    length: 50,
    nullable: true,
  })
  state?: string;

  @Column({
    length: 30,
    nullable: true,
  })
  zipCode?: string;

  @Column({
    length: 50,
    nullable: true,
  })
  country?: string;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.shipping, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userProfile: UserProfile;
}
