import { EnumWorkType } from '@avo/type';

import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { UserProfile } from './user-profile.entity';
import { BaseEntity } from '@/database/entity';

@Entity({ name: 'user_profile_companies' })
export class UserProfileCompany extends BaseEntity<UserProfileCompany> {
  @Column({
    length: 100,
    nullable: true,
  })
  name?: string;

  @Column({
    length: 100,
    nullable: true,
  })
  jobRole?: string;

  @Column({
    type: 'enum',
    enum: EnumWorkType,
    nullable: true,
  })
  jobType?: EnumWorkType;

  @Column({
    length: 100,
    nullable: true,
  })
  department?: string;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.company, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userProfile: UserProfile;
}
