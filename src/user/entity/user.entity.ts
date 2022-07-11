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
import { BaseEntity } from '@/database/entities/base.entity';
import { Organization } from '@/organization/entity/organization.entity';
import { AclRole } from '@acl/role/entity/acl-role.entity';
import { UserAuthConfig } from '@/auth/entity/user-auth-config.entity';
//

@Entity()
export class User extends BaseEntity<User> {
  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Index()
  @Column({
    unique: true,
    nullable: true,
  })
  mobileNumber?: string;

  @Index()
  @Column({
    type: 'varchar',
    unique: true,
    length: 100,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  title?: string;

  @Column({
    default: false,
  })
  isActive!: boolean;

  @OneToOne(() => UserAuthConfig, {
    cascade: true,
  })
  @JoinColumn()
  authConfig!: UserAuthConfig;

  @ManyToOne(() => AclRole, (role) => role.users, { nullable: true })
  role?: AclRole;

  @ManyToOne(() => Organization, (organization) => organization.users, {
    nullable: true,
  })
  organization?: Organization;

  @BeforeInsert()
  beforeInsert() {
    this.email = this.email.toLowerCase();
  }
}
