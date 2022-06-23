import { Entity, Column, Index, ManyToOne, BeforeInsert } from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { Organization } from '@/organization/entity/organization.entity';
import { AclRole } from '@acl/role/entity/acl-role.entity';

@Entity()
export class User extends BaseEntity<User> {
  @Column({ nullable: true })
  firstName!: string;

  @Column({ nullable: true })
  lastName?: string;

  @Index('user_mobile_index')
  @Column({
    unique: true,
    nullable: true,
  })
  mobileNumber?: string;

  @Index('user_email_index')
  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @Column()
  passwordExpired!: Date;

  @Column()
  salt!: string;

  @Column({
    default: false,
  })
  isActive!: boolean;

  @Column({
    default: false,
  })
  emailVerified!: boolean;

  @Column({ nullable: true })
  emailVerificationToken?: string;

  @ManyToOne(() => AclRole, (role) => role.users)
  role!: AclRole;

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization!: Organization;

  @BeforeInsert()
  beforeInsert() {
    this.firstName = this.firstName || this.email;
  }
}
