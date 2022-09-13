import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { IResult } from 'ua-parser-js';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Entity()
export class ForgotPasswordLink extends BaseEntity<ForgotPasswordLink> {
  @Index()
  @Column({
    length: 50,
    update: false,
  })
  email!: string;

  @Index()
  @Column({
    unique: true,
    length: 21,
    update: false,
  })
  code!: string;

  @Column({ nullable: true })
  usedAt?: Date;

  @Column({ nullable: true })
  expiresAt?: Date;
}
