import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '@/database/entity';

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
    length: 32,
    nullable: true,
  })
  loginCode?: string;

  @Column({ nullable: true })
  loginCodeExpiredAt?: Date;
}
