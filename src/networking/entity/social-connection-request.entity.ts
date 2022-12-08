import {
  EnumNetworkingConnectionRequestStatus,
  NetworkingConnectionRequestStatusType,
} from '@avo/type';

import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Unique('uq_addressed_addressee_social_connection_request', [
  'addresserUser',
  'addresseeUser',
  'tempAddresseeEmail',
  'status',
])
@Entity()
export class SocialConnectionRequest extends BaseEntity<SocialConnectionRequest> {
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn()
  addresserUser!: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  addresseeUser?: User;

  @Column({
    length: 100,
    nullable: true,
  })
  tempAddresseeEmail?: string;

  @Column({
    length: 1000,
    nullable: true,
  })
  personalNote?: string;

  @Column({
    type: 'enum',
    enum: EnumNetworkingConnectionRequestStatus,
    default: EnumNetworkingConnectionRequestStatus.Pending,
  })
  status: NetworkingConnectionRequestStatusType;
}
