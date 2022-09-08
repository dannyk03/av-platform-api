import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { UserProfile } from './user-profile.entity';
import { UserAuthConfig } from '@/auth/entity';
import { BaseEntity } from '@/database/entity';
import { Organization } from '@/organization/entity';
import { AclRole } from '@acl/role/entity';

@Entity()
export class User extends BaseEntity<User> {
  @Index()
  @Column({
    unique: true,
    length: 50,
  })
  email!: string;

  @Index()
  @Column({
    length: 30,
    unique: true,
    nullable: true,
  })
  phoneNumber?: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @ManyToOne(() => AclRole, (role) => role.users, { nullable: true })
  role?: AclRole;

  @ManyToOne(() => Organization, (organization) => organization.users, {
    nullable: true,
  })
  organization?: Organization;

  @OneToOne(() => UserAuthConfig, (authConfig) => authConfig.user, {
    cascade: true,
    nullable: true,
  })
  authConfig?: UserAuthConfig;

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: true,
  })
  profile: UserProfile;

  @BeforeInsert()
  beforeInsert() {
    this.email = this.email?.toLowerCase();
  }
}
