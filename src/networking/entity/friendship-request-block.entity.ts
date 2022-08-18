import { Entity, JoinColumn, ManyToOne, OneToOne, Unique } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Entity()
@Unique('uq_blocking_blocked_connection_request', [
  'blockingUser',
  'blockedUser',
])
export class FriendshipRequestBlock extends BaseEntity<FriendshipRequestBlock> {
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn()
  blockingUser: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn()
  blockedUser: User;
}
