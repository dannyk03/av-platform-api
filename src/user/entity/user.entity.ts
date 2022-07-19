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
//

@Entity()
export class User extends BaseEntity<User> {
  @Column({
    length: 30,
    nullable: true,
  })
  firstName?: string;

  @Column({
    length: 30,
    nullable: true,
  })
  lastName?: string;

  @Index()
  @Column({
    length: 30,
    unique: true,
    nullable: true,
  })
  phoneNumber?: string;

  @Index()
  @Column({
    unique: true,
    length: 50,
  })
  email!: string;

  @Column({
    length: 100,
    nullable: true,
  })
  title?: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @OneToOne(() => UserAuthConfig, {
    lazy: true,
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

  @BeforeInsert()
  beforeInsert() {
    this.email = this.email.toLowerCase();
  }
}
