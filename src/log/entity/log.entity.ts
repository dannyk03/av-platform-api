import { EnumLoggerAction, EnumLoggerLevel } from '../log.constant';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IResult } from 'ua-parser-js';
import { User } from '@/user/entity/user.entity';

@Entity()
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ enum: EnumLoggerLevel, update: false })
  level!: string;

  @Column({ enum: EnumLoggerAction, update: false })
  action!: string;

  @ManyToOne(() => User)
  user?: User;

  @Column({
    nullable: true,
    update: false,
  })
  description!: string;

  @Column({
    type: 'varchar',
    array: true,
    length: 20,
    nullable: true,
    update: false,
  })
  tags?: string[];

  @Column({
    type: 'uuid',
    update: false,
  })
  correlationId: string;

  @Column({
    type: 'json',
    update: false,
  })
  userAgent: IResult;

  @Column({
    type: 'varchar',
    length: 20,
    update: false,
  })
  method: string;

  @Column({
    type: 'varchar',
    length: 50,
    update: false,
  })
  originalUrl: string;

  @CreateDateColumn({
    update: false,
  })
  createdAt!: Date;
}
