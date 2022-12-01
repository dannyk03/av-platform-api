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

import { EnumLogAction, EnumLogLevel } from '../constant';

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

  @ManyToOne(() => User, {
    nullable: true,
    cascade: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: User;

  @Column({
    nullable: true,
    length: 1000,
    update: false,
  })
  description?: string;

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
    type: 'jsonb',
    update: false,
  })
  headers?: Record<string, any>;

  @Column({
    nullable: true,
    update: false,
  })
  statusCode?: number;

  @Column({
    type: 'varchar',
    array: true,
    length: 200,
    default: [],
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
    length: 100,
    update: false,
  })
  path!: string;

  @Column({
    length: 3,
    nullable: true,
    update: false,
  })
  version!: string;

  @Column({
    length: 15,
    update: false,
  })
  repoVersion!: string;

  @Column({
    length: 100,
    update: false,
  })
  exec!: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  data?: object;

  @CreateDateColumn({
    update: false,
  })
  createdAt!: Date;
}
