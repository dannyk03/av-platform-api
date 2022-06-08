import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RoleEntity } from '@/role/entity/role.entity';
import { BaseEntity } from '@/database/entities/base.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  // constructor(user?: Partial<UserEntity>) {
  //   super();
  //   Object.assign(this, user);
  // }

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Index('user_mobile_index')
  @Column({
    unique: true,
  })
  mobileNumber: string;

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
  emailVerified: boolean;

  @Column()
  emailVerificationToken: string;

  @ManyToMany(() => RoleEntity, (role) => role.id, {
    eager: true,
    cascade: false,
  })
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles!: RoleEntity[];
}
