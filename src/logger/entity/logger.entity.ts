import { ENUM_LOGGER_ACTION, ENUM_LOGGER_LEVEL } from '../logger.constant';
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

  @Column({ enum: ENUM_LOGGER_LEVEL, update: false })
  level: string;

  @Column({ enum: ENUM_LOGGER_ACTION, update: false })
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
