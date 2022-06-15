import {
  Entity,
  Column,
  JoinTable,
  OneToMany,
  BeforeInsert,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { AcpRole } from '@/access-control-policy/role';
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
  roles: AcpRole[];

  // @JoinTable({
  //   name: 'organization_user',
  //   joinColumn: {
  //     name: 'organization_id',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'user_id',
  //     referencedColumnName: 'id',
  //   },
  // })
  @OneToMany(() => User, (user) => user.id, {
    // eager: true,
    cascade: true,
  })
  users: User[];

  // @OneToOne(() => User, {
  //   cascade: true,
  //   // onDelete: 'CASCADE',
  // })
  // @JoinColumn()
  // owner: User;

  @BeforeInsert()
  beforeInsert() {
    this.slug = createSlugFromString(this.name);
  }
}
