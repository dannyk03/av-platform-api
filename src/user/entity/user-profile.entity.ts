import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { User } from './user.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class UserProfile extends BaseEntity<UserProfile> {
  @Column({
    length: 30,
    nullable: true,
  })
  firstName: string;

  @Column({
    length: 30,
    nullable: true,
  })
  lastName: string;

  @Column({
    length: 30,
    nullable: true,
  })
  city?: string;

  @Column({
    length: 30,
    nullable: true,
  })
  state?: string;

  @Column({
    length: 30,
    nullable: true,
  })
  country?: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  personas?: object;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  dietary?: object;

  @OneToOne(() => User, (user) => user.authConfig, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
