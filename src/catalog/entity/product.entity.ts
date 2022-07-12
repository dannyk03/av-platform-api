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
import { BaseEntity } from '@/database/entities/base.entity';
import { Organization } from '@/organization/entity/organization.entity';
import { AclRole } from '@acl/role/entity/acl-role.entity';
import { UserAuthConfig } from '@/auth/entity/user-auth-config.entity';
//

@Entity()
export class Product extends BaseEntity<Product> {
  @Index()
  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    default: false,
  })
  isActive!: boolean;
}
