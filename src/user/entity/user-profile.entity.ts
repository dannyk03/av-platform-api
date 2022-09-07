import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { UserProfileHome } from './user-profile-home.entity';
import { UserProfileShipping } from './user-profile-shipping.entity';
import { User } from './user.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class UserProfile extends BaseEntity<UserProfile> {
  @Column({
    length: 30,
    nullable: true,
  })
  firstName: string;

  @Column({
    length: 30,
    nullable: true,
  })
  lastName: string;

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

  @OneToOne(() => User, (user) => user.authConfig, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
