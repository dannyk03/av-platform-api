import { createSlugFromString } from '@/utils/helper/service/helper.slug.service';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';

@Entity({ name: 'permissions' })
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('permission_slug_index')
  @Column({
    update: false,
    unique: true,
  })
  slug: string;

  // @Column({ unique: true })
  // name: string;

  // @ManyToMany(() => Role , (role) => role.id)
  // @JoinTable({
  //   name: 'Permission_Role',
  //   joinColumn: {
  //     name: 'permissionId',
  //     referencedColumnName: 'id'
  //   },
  //   inverseJoinColumn: {
  //     name: 'roleId',
  //     referencedColumnName: 'id'
  //   }
  // })
  // roles: Role[];

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    nullable: true,
  })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.slug = createSlugFromString(this.slug);
  }
}
