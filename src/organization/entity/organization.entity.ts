import {
  Entity,
  Column,
  JoinTable,
  OneToMany,
  BeforeInsert,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { AcpRole } from '@acp/role';
import { User } from '@/user/entity/user.entity';
import { BaseEntity } from '@/database/entities/base.entity';
import { createSlugFromString } from '@/utils/helper/service/helper.slug.service';

@Entity()
export class Organization extends BaseEntity<Organization> {
  @Column({
    unique: true,
    length: 30,
  })
  name!: string;

  @Column({
    unique: true,
    length: 30,
  })
  slug!: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @OneToMany(() => AcpRole, (role) => role.id, {
    // eager: true,
    cascade: true,
  })
  @JoinTable({
    name: 'organization_role',
    joinColumn: {
      name: 'organization_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: AcpRole[];

  @OneToMany(() => AcpRole, (role) => role.id, {
    // eager: true,
    // cascade: false,
  })
  @JoinTable({
    name: 'organization_user',
    joinColumn: {
      name: 'organization_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @OneToOne(() => User, {
    cascade: true,
    // onDelete: 'CASCADE',
  })
  @JoinColumn()
  owner: User;

  @BeforeInsert()
  beforeInsert() {
    this.slug = createSlugFromString(this.name);
  }
}
