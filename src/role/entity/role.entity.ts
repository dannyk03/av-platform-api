import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { PermissionEntity } from '@/permission/entity/permission.entity';
import { createSlugFromString } from '@/utils/helper/service/helper.slug.service';

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntity {
  // constructor(role?: Partial<RoleEntity>) {
  //   super();
  //   Object.assign(this, role);
  // }

  @Index('role_slug_index')
  @Column({
    update: false,
    unique: true,
    length: 20,
  })
  slug: string;

  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  @ManyToMany(() => PermissionEntity, (permission) => permission.id, {
    eager: true,
    cascade: false,
  })
  permissions: PermissionEntity[];

  @Column({
    default: true,
  })
  isActive: boolean;

  @BeforeInsert()
  beforeInsert() {
    this.slug = createSlugFromString(this.slug);
  }
}
