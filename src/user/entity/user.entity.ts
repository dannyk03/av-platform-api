import {
  Entity,
  Column,
  Index,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { Organization } from '@/organization/entity/organization.entity';
import { AcpRole } from '@/access-control-policy/role/entity/acp-role.entity';

@Entity()
export class User extends BaseEntity<User> {
  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Index('user_mobile_index')
  @Column({
    unique: true,
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

  @Column()
  emailVerificationToken!: string;

  // @ManyToMany(() => AcpRole, (role) => role.id, {
  //   // eager: true,
  //   cascade: true,
  // })
  // @JoinTable({
  //   name: 'user_role',
  //   joinColumn: {
  //     name: 'user_id',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'role_id',
  //     referencedColumnName: 'id',
  //   },
  // })
  @ManyToOne(() => AcpRole, (role) => role.users)
  role!: AcpRole;

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization!: Organization;
}
