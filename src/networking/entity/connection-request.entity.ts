import {
  EnumNetworkingConnectionRequestStatus,
  NetworkingConnectionRequestStatusType,
} from '@avo/type';

import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Entity()
@Unique('uq_requested_addressee_connection_request', [
  'requestedUser',
  'addresseeUser',
  'status',
])
export class ConnectionRequest extends BaseEntity<ConnectionRequest> {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  requestedUser: User;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  addresseeUser: User;

  @Column({
    length: 30,
  })
  tempAddresseeEmail: string;

  @Column({
    type: 'enum',
    enum: EnumNetworkingConnectionRequestStatus,
  })
  status: NetworkingConnectionRequestStatusType;
}
