import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IResult } from 'ua-parser-js';

import { User } from '@/user/entity';
import { AclRole } from '@acl/role/entity';

import { EnumLogAction, EnumLogLevel } from '../log.constant';

@Entity()
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ enum: EnumLogLevel, update: false })
  level!: string;

  @Column({ enum: EnumLogAction, update: false })
  action!: string;

  @ManyToOne(() => AclRole, { nullable: true, cascade: false })
  @JoinColumn()
  role?: AclRole;

  @ManyToOne(() => User, { nullable: true, cascade: false })
  @JoinColumn()
  user?: User;

  @Column({
    length: 200,
    update: false,
  })
  description!: string;

  @Column({
    nullable: true,
    type: 'json',
    update: false,
  })
  params?: Record<string, any>;

  @Column({
    nullable: true,
    type: 'jsonb',
    update: false,
  })
  body?: Record<string, any>;

  @Column({
    nullable: true,
    update: false,
  })
  statusCode?: number;

  @Column({
    type: 'varchar',
    array: true,
    length: 20,
    nullable: true,
    update: false,
  })
  tags?: string[];

  @Column({
    length: 25,
    update: false,
  })
  correlationId!: string;

  @Column({
    type: 'json',
    update: false,
  })
  userAgent!: IResult;

  @Column({
    length: 20,
    update: false,
  })
  method!: string;

  @Column({
    length: 50,
    update: false,
  })
  originalUrl!: string;

  @Column({
    length: 3,
    nullable: true,
    update: false,
  })
  version!: string;

  @CreateDateColumn({
    update: false,
  })
  createdAt!: Date;
}
