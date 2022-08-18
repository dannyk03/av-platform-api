import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { FriendshipRequestBlock } from '../entity';

import { ConnectionNames } from '@/database';

@Injectable()
export class FriendshipRequestBlockService {
  private readonly uploadPath: string;

  constructor(
    @InjectRepository(FriendshipRequestBlock, ConnectionNames.Default)
    private friendshipRequestBlockRepository: Repository<FriendshipRequestBlock>,
  ) {}

  async create(
    props: DeepPartial<FriendshipRequestBlock>,
  ): Promise<FriendshipRequestBlock> {
    return this.friendshipRequestBlockRepository.create(props);
  }

  async save(
    friendshipRequestBlock: FriendshipRequestBlock,
  ): Promise<FriendshipRequestBlock> {
    return this.friendshipRequestBlockRepository.save<FriendshipRequestBlock>(
      friendshipRequestBlock,
    );
  }

  async findOne(
    find: FindOneOptions<FriendshipRequestBlock>,
  ): Promise<FriendshipRequestBlock> {
    return this.friendshipRequestBlockRepository.findOne(find);
  }

  async findOneBy(
    find:
      | FindOptionsWhere<FriendshipRequestBlock>
      | FindOptionsWhere<FriendshipRequestBlock>[],
  ): Promise<FriendshipRequestBlock> {
    return this.friendshipRequestBlockRepository.findOneBy(find);
  }

  async findBlockRequest({
    fromEmail,
    toEmail,
  }: {
    fromEmail: string;
    toEmail: string;
  }) {
    return this.friendshipRequestBlockRepository
      .createQueryBuilder('friendshipBlock')
      .setParameters({ fromEmail, toEmail })
      .leftJoinAndSelect('friendshipBlock.blockingUser', 'blockingUser')
      .leftJoinAndSelect('friendshipBlock.blockedUser', 'blockedUser')
      .where('blockingUser.email = :fromEmail')
      .andWhere('blockedUser.email = :toEmail')
      .getOne();
  }
}
