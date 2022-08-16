import { Entity, JoinColumn, OneToOne, Unique } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Entity()
@Unique('uq_requested_addressee_connection', ['requestedUser', 'addresseeUser'])
export class Connection extends BaseEntity<Connection> {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  requestedUser: User;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  addresseeUser: User;
}
