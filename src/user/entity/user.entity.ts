import { Entity, Column, Index, ManyToOne, BeforeInsert } from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entities/base.entity';
import { Organization } from '@/organization/entity/organization.entity';
import { AclRole } from '@acl/role/entity/acl-role.entity';
//

@Entity()
export class User extends BaseEntity<User> {
  @Column({ nullable: true })
  firstName!: string;

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
  })
  password!: string;

  @Column()
  passwordExpired!: Date;

  @Column({
    type: 'varchar',
    length: 100,
  })
  salt!: string;

  @Column({
    default: false,
  })
  isActive!: boolean;

  @Column({
    default: false,
  })
  emailVerified!: boolean;

  @ManyToOne(() => AclRole, (role) => role.users)
  role!: AclRole;

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization!: Organization;
}
