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
import { PermissionEntity } from '@/permission/entity/permission.entity';
import { createSlugFromString } from '@/utils/helper/service/helper.slug.service';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('role_slug_index')
  @Column({
    unique: true,
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
  @ManyToMany(() => PermissionEntity, (role) => role.id)
  permissions: PermissionEntity[];

  @Column({
    default: true,
  })
  isActive: boolean;

  // @Column({
  //   default: false,
  // })
  // isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.slug = createSlugFromString(this.slug);
  }
}
