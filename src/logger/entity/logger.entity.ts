import { ENUM_LOGGER_ACTION, ENUM_LOGGER_LEVEL } from '../logger.constant';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'logs' })
export class LoggerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: ENUM_LOGGER_LEVEL })
  level: string;

  @Column({ enum: ENUM_LOGGER_ACTION })
  action: string;

  // @OneToOne(() => User)
  // @JoinColumn()
  // user?: User;

  // apiKey: Types.ObjectId;

  anonymous: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text', array: true, default: [] })
  tags?: string[];

  @CreateDateColumn()
  createdAt: Date;
}
