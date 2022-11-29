import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isNumber } from 'class-validator';
import {
  Brackets,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { SocialConnection } from '../entity';

import { HelperStringService } from '@/utils/helper/service';

import { ISocialConnectionSearch } from '../type';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class SocialConnectionService {
  constructor(
    @InjectRepository(SocialConnection, ConnectionNames.Default)
    private readonly socialConnectionRepository: Repository<SocialConnection>,
    private readonly helperStringService: HelperStringService,
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
      .leftJoinAndSelect('user2.profile', 'user2Profile')
      .setParameters({ userEmail })
      .where('user1.email = :userEmail');

    if (extraDataForConnection) {
      builder.leftJoinAndSelect('user2.profile', 'user2profile');
    }

    if (search) {
      const formattedSearch = this.helperStringService.tsQueryParam(search);
      builder.andWhere(
        new Brackets((qb) => {
          qb.where(
            `to_tsvector('english', CONCAT_WS(' ', user2.email, user2Profile.firstName, user2Profile.lastName)) @@ to_tsquery('english', :search)`,
            { search: `${formattedSearch}` },
          );
        }),
      );
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
}
