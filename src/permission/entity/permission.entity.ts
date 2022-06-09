import { BaseEntity } from '@/database/entities/base.entity';
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

@Entity()
export class Permission extends BaseEntity<Permission> {
  // constructor(permission?: Partial<PermissionEntity>) {
  //   super();
  //   Object.assign(this, permission);
  // }

  @Index('permission_slug_index')
  @Column({
    update: false,
    unique: true,
    length: 20,
  })
  slug: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    nullable: true,
  })
  description?: string;

  @BeforeInsert()
  beforeInsert() {
    this.slug = createSlugFromString(this.slug);
  }
}
