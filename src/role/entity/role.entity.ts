import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { PermissionEntity } from '@/permission/entity/permission.entity';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Index('role_slug_index')
  @Column({
    unique: true,
  })
  slug: string;

  // @Column({
  //   type: Array,
  //   default: [],
  //   ref: PermissionEntity.name,
  // })
  // permissions: Types.ObjectId[];

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    default: false,
  })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
