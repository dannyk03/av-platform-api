import { Entity, Column, Index, JoinColumn, OneToOne } from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';
//
import { IResult } from 'ua-parser-js';

@Entity()
export class SignUpEmailVerificationLink extends BaseEntity<SignUpEmailVerificationLink> {
  @Index()
  @Column({
    unique: true,
    length: 50,
    update: false,
  })
  email!: string;

  @Index()
  @Column({
    unique: true,
    length: 32,
    update: false,
  })
  signUpCode!: string;

  @Column({ nullable: true })
  usedAt?: Date;

  @Column({ nullable: true })
  expiresAt!: Date;

  @Column({
    type: 'json',
    update: false,
  })
  userAgent: IResult;

  @OneToOne(() => User, {
    cascade: ['insert'],
  })
  @JoinColumn()
  user!: User;
}
