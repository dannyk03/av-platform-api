import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Entity()
@Unique('uq_addressed_addressee_social_connection', [
  'addressedUser',
  'addresseeUser',
])
export class SocialConnection extends BaseEntity<SocialConnection> {
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn()
  addressedUser: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn()
  addresseeUser: User;
}
