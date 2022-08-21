import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Entity()
@Unique('uq_blocking_blocked_social_connection_request_block', [
  'blockingUser',
  'blockedUser',
])
export class SocialConnectionRequestBlock extends BaseEntity<SocialConnectionRequestBlock> {
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn()
  blockingUser: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn()
  blockedUser: User;
}
