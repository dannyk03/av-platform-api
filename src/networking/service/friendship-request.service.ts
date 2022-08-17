import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
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
}
