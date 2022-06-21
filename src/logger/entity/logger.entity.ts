import { EnumLoggerAction, EnumLoggerLevel } from '../logger.constant';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'loggers' })
export class LoggerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: EnumLoggerLevel, update: false })
  level: string;

  @Column({ enum: EnumLoggerAction, update: false })
  action: string;

  // @OneToOne(() => User)
  // @JoinColumn()
  // user?: User;

  // apiKey: Types.ObjectId;

  // anonymous: boolean;

  @Column({ nullable: true, update: false })
  description: string;

  @Column({
    type: 'varchar',
    array: true,
    length: 20,
    nullable: true,
    update: false,
  })
  tags?: string[];

  @CreateDateColumn({
    update: false,
  })
  createdAt: Date;
}
