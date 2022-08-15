import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Entity()
export class UserAuthConfig extends BaseEntity<UserAuthConfig> {
  @Column({
    length: 100,
    nullable: true,
  })
  password?: string;

  @Column({
    length: 100,
    nullable: true,
  })
  salt?: string;

  @Column({ nullable: true })
  passwordExpiredAt?: Date;

  @Column({
    nullable: true,
  })
  emailVerifiedAt?: Date;

  @Index()
  @Column({
    unique: true,
    length: 21,
    nullable: true,
  })
  loginCode?: string;

  @Column({ nullable: true })
  loginCodeExpiredAt?: Date;

  @OneToOne(() => User, (user) => user.authConfig, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
