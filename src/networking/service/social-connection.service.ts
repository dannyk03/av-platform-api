import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { isNumber } from 'class-validator';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { SocialConnection } from '../entity';

import { SocialConnectionGetSerialization } from '../serialization/social-connection.get.serialization';

import { ISocialConnectionSearch } from '../networking.interface';

import { ConnectionNames } from '@/database';

@Injectable()
export class SocialConnectionService {
  constructor(
    @InjectRepository(SocialConnection, ConnectionNames.Default)
    private socialConnectionRepository: Repository<SocialConnection>,
  ) {}

  async create(
    props: DeepPartial<SocialConnection>,
  ): Promise<SocialConnection> {
    return this.socialConnectionRepository.create(props);
  }

  async save(socialConnection: SocialConnection): Promise<SocialConnection> {
    return this.socialConnectionRepository.save<SocialConnection>(
      socialConnection,
    );
  }

  async findOne(
    find: FindOneOptions<SocialConnection>,
  ): Promise<SocialConnection> {
    return this.socialConnectionRepository.findOne(find);
  }

  async findOneBy(
    find:
      | FindOptionsWhere<SocialConnection>
      | FindOptionsWhere<SocialConnection>[],
  ): Promise<SocialConnection> {
    return this.socialConnectionRepository.findOneBy(find);
  }

  async getListSearchBuilder({
    search,
    userEmail,
    extraDataForConnection = false,
  }: ISocialConnectionSearch): Promise<SelectQueryBuilder<SocialConnection>> {
    const builder = this.socialConnectionRepository
      .createQueryBuilder('socialConnection')
      .leftJoinAndSelect('socialConnection.user1', 'user1')
      .leftJoinAndSelect('socialConnection.user2', 'user2')
      .setParameters({ userEmail })
      .where('user1.email = :userEmail');

    if (extraDataForConnection) {
      builder.leftJoinAndSelect('user2.profile', 'user2profile');
    }

    if (search) {
      builder.setParameters({ search, likeSearch: `%${search}%` });
      builder.andWhere('user2.email ILIKE :likeSearch');
    }

    return builder;
  }

  async getTotal({
    search,
    userEmail,
  }: ISocialConnectionSearch): Promise<number> {
    const searchBuilder = await this.getListSearchBuilder({
      search,
      userEmail,
    });

    return searchBuilder.getCount();
  }

  async paginatedSearchBy({
    search,
    userEmail,
    options,
  }: ISocialConnectionSearch): Promise<SocialConnection[]> {
    const searchBuilder = await this.getListSearchBuilder({
      extraDataForConnection: true,
      search,
      userEmail,
    });

    if (options.order) {
      searchBuilder.orderBy(options.order);
    }

    if (isNumber(options.take) && isNumber(options.skip)) {
      searchBuilder.take(options.take).skip(options.skip);
    }

    return searchBuilder.getMany();
  }

  async checkIsBiDirectionalSocialConnected({
    user1Email,
    user2Email,
  }: {
    user1Email: string;
    user2Email: string;
  }): Promise<boolean> {
    const biDirectionalSocialConnection =
      await this.socialConnectionRepository.find({
        where: [
          { user1: { email: user1Email }, user2: { email: user2Email } },
          { user1: { email: user2Email }, user2: { email: user1Email } },
        ],
        select: {
          user1: { email: true },
          user2: { email: true },
        },
      });

    return Boolean(biDirectionalSocialConnection.length);
  }

  async serializationSocialConnectionList(
    data: SocialConnection[],
  ): Promise<SocialConnectionGetSerialization[]> {
    return plainToInstance(SocialConnectionGetSerialization, data);
  }

  async serializationSocialConnection(
    data: SocialConnection,
  ): Promise<SocialConnectionGetSerialization> {
    return plainToInstance(SocialConnectionGetSerialization, data);
  }
}
