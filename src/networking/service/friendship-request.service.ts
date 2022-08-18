import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumNetworkingConnectionRequestStatus } from '@avo/type';

import {
  Brackets,
  DataSource,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { FriendshipRequest } from '../entity';

import { ConnectionNames } from '@/database';

@Injectable()
export class FriendshipRequestService {
  private readonly uploadPath: string;

  constructor(
    @InjectRepository(FriendshipRequest, ConnectionNames.Default)
    private friendshipRequestRepository: Repository<FriendshipRequest>,
  ) {}

  async create(
    props: DeepPartial<FriendshipRequest>,
  ): Promise<FriendshipRequest> {
    return this.friendshipRequestRepository.create(props);
  }

  async save(friendshipRequest: FriendshipRequest): Promise<FriendshipRequest> {
    return this.friendshipRequestRepository.save<FriendshipRequest>(
      friendshipRequest,
    );
  }

  async findOne(
    find: FindOneOptions<FriendshipRequest>,
  ): Promise<FriendshipRequest> {
    return this.friendshipRequestRepository.findOne(find);
  }

  async findOneBy(
    find:
      | FindOptionsWhere<FriendshipRequest>
      | FindOptionsWhere<FriendshipRequest>[],
  ): Promise<FriendshipRequest> {
    return this.friendshipRequestRepository.findOneBy(find);
  }

  async find(
    find: FindManyOptions<FriendshipRequest>,
  ): Promise<FriendshipRequest[]> {
    return this.friendshipRequestRepository.find(find);
  }

  async findPendingRequest({ from, to }: { from: string; to: string }) {
    return (
      this.friendshipRequestRepository
        .createQueryBuilder('friendshipReq')
        .setParameters({ from, to })
        .where('friendshipReq.status = :status', {
          status: EnumNetworkingConnectionRequestStatus.Pending,
        })
        .innerJoin('friendshipReq.requestedUser', 'requestedUser')
        .andWhere('requestedUser.email = :from')
        .innerJoin('friendshipReq.addresseeUser', 'addresseeUser')
        // .andWhere(
        //   new Brackets((qb) => {
        //     qb.where('addresseeUser.email = :to').orWhere(
        //       'friendshipReq.tempAddresseeEmail = :to',
        //     );
        //   }),
        // )
        .getMany()
    );
  }
}
