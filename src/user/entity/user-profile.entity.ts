import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { UserProfileHome } from './user-profile-home.entity';
import { UserProfileMailing } from './user-profile-mailing.entity';
import { UserProfileShipping } from './user-profile-shipping.entity';
import { User } from './user.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class UserProfile extends BaseEntity<UserProfile> {
  @Column({
    length: 50,
    nullable: true,
  })
  firstName: string;

  @Column({
    length: 50,
    nullable: true,
  })
  lastName: string;

  @Column({
    length: 2,
    nullable: true,
  })
  birthMonth: string;

  @Column({
    length: 2,
    nullable: true,
  })
  birthDay: string;

  @Column({
    length: 2,
    nullable: true,
  })
  workAnniversaryMonth: string;

  @Column({
    length: 2,
    nullable: true,
  })
  workAnniversaryDay: string;

  @Column({
    type: 'varchar',
    length: 500,
    array: true,
    default: [],
  })
  funFacts: string[];

  @Column({
    type: 'varchar',
    length: 100,
    array: true,
    default: [],
  })
  desiredSkills: string[];

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  kidFriendlyActivities?: object;

  @OneToOne(
    () => UserProfileHome,
    (userProfileHome) => userProfileHome.userProfile,
    {
      cascade: true,
      nullable: true,
    },
  )
  home: UserProfileHome;

  @OneToOne(
    () => UserProfileShipping,
    (userProfileShipping) => userProfileShipping.userProfile,
    {
      cascade: true,
      nullable: true,
    },
  )
  shipping: UserProfileShipping;

  @OneToOne(
    () => UserProfileMailing,
    (userProfileMailing) => userProfileMailing.userProfile,
    {
      cascade: true,
      nullable: true,
    },
  )
  mailing: UserProfileMailing;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  personas?: object;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  dietary?: object;

  @OneToOne(() => User, (user) => user.profile, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
