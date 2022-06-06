import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { RoleEntity } from '@/role/entity/role.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  email: string;

  // @Column({
  //   type: Types.ObjectId,
  //   ref: RoleEntity.name,
  // })
  // role: RoleEntity;

  @Column()
  password: string;

  @Column()
  passwordExpired: Date;

  @Column()
  salt: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
