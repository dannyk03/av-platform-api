import { Entity, JoinColumn, OneToOne, Unique } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Entity()
@Unique('uq_blocking_blocked_connection_request', [
  'blockingUser',
  'blockedUser',
])
export class FriendshipRequestBlock extends BaseEntity<FriendshipRequestBlock> {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  blockingUser: User;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  blockedUser: User;
}
