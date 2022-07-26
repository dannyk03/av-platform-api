import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IResult } from 'ua-parser-js';
import { EnumLoggerAction, EnumLoggerLevel } from '../log.constant';
// Entities
import { User } from '$/user/entity';
//

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
    length: 20,
    update: false,
  })
  method: string;

  @Column({
    length: 50,
    update: false,
  })
  originalUrl: string;

  @CreateDateColumn({
    update: false,
  })
  createdAt!: Date;
}
