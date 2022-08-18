import {
  EnumNetworkingConnectionRequestStatus,
  NetworkingConnectionRequestStatusType,
} from '@avo/type';

import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Unique('uq_addressed_addressee_connection_request', [
  'addressedUser',
  'addresseeUser',
  'tempAddresseeEmail',
  'status',
])
@Entity()
export class FriendshipRequest extends BaseEntity<FriendshipRequest> {
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn()
  addressedUser: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  addresseeUser: User;

  @Column({
    length: 30,
    nullable: true,
  })
  tempAddresseeEmail: string;

  @Column({
    type: 'enum',
    enum: EnumNetworkingConnectionRequestStatus,
    default: EnumNetworkingConnectionRequestStatus.Pending,
  })
  status: NetworkingConnectionRequestStatusType;
}
