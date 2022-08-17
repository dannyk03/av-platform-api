import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Friendship } from '../entity';

import { ConnectionNames } from '@/database';

@Injectable()
export class FriendshipService {
  private readonly uploadPath: string;

  constructor(
    @InjectRepository(Friendship, ConnectionNames.Default)
    private friendshipRepository: Repository<Friendship>,
  ) {}

  async create(props: DeepPartial<Friendship>): Promise<Friendship> {
    return this.friendshipRepository.create(props);
  }

  async save(friendship: Friendship): Promise<Friendship> {
    return this.friendshipRepository.save<Friendship>(friendship);
  }

  async findOne(find: FindOneOptions<Friendship>): Promise<Friendship> {
    return this.friendshipRepository.findOne(find);
  }

  async findOneBy(
    find: FindOptionsWhere<Friendship> | FindOptionsWhere<Friendship>[],
  ): Promise<Friendship> {
    return this.friendshipRepository.findOneBy(find);
  }
}
