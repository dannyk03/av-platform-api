import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToOne,
  BeforeInsert,
} from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
import { Organization } from '@/organization/entity';
import { AclRole } from '@acl/role/entity';
import { UserAuthConfig } from '@/auth/entity';
import { UserProfile } from './user-profile.entity';
//

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

  @OneToOne(() => UserAuthConfig, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  authConfig?: UserAuthConfig;

  @ManyToOne(() => AclRole, (role) => role.users, { nullable: true })
  role?: AclRole;

  @ManyToOne(() => Organization, (organization) => organization.users, {
    nullable: true,
  })
  organization?: Organization;

  @OneToOne(() => UserProfile, { cascade: true, nullable: true })
  @JoinColumn()
  profile?: UserProfile;

  @BeforeInsert()
  beforeInsert() {
    this.email = this.email.toLowerCase();
  }
}
