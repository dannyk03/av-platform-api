import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Entity()
@Unique('uq_connection_users_social_connection', ['user1', 'user2'])
export class SocialConnection extends BaseEntity<SocialConnection> {
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn()
  user1: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn()
  user2: User;
}
