import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  EnumNetworkingConnectionRequestStatus,
  EnumNetworkingStatusCodeError,
} from '@avo/type';

import { isNumber } from 'class-validator';
import { compact } from 'lodash';
import {
  Brackets,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { SocialConnectionRequest } from '../entity';

import { ISocialConnectionRequestSearch } from '../type';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class SocialConnectionRequestService {
  constructor(
    @InjectRepository(SocialConnectionRequest, ConnectionNames.Default)
    private socialConnectionRequestRepository: Repository<SocialConnectionRequest>,
  ) {}

  async create(
    props: DeepPartial<SocialConnectionRequest>,
  ): Promise<SocialConnectionRequest> {
    return this.socialConnectionRequestRepository.create(props);
  }

  async save(
    socialConnectionRequest: SocialConnectionRequest,
  ): Promise<SocialConnectionRequest> {
    return this.socialConnectionRequestRepository.save<SocialConnectionRequest>(
      socialConnectionRequest,
    );
  }

  async findOne(
    find: FindOneOptions<SocialConnectionRequest>,
  ): Promise<SocialConnectionRequest> {
    return this.socialConnectionRequestRepository.findOne(find);
  }

  async findOneBy(
    find:
      | FindOptionsWhere<SocialConnectionRequest>
      | FindOptionsWhere<SocialConnectionRequest>[],
  ): Promise<SocialConnectionRequest> {
    return this.socialConnectionRequestRepository.findOneBy(find);
  }

  async find(
    find: FindManyOptions<SocialConnectionRequest>,
  ): Promise<SocialConnectionRequest[]> {
    return this.socialConnectionRequestRepository.find(find);
  }

  async findPendingSocialConnectionRequestByEmailOrUserIds({
    email,
    reqUserId,
    userIds,
  }): Promise<SocialConnectionRequest[] | null> {
    if ((userIds && email) || !(userIds || email)) {
      throw new UnprocessableEntityException({
        statusCode:
          EnumNetworkingStatusCodeError.NetworkingConnectionRequestsUnprocessableError,
        message: 'networking.error.unprocessable',
      });
    }

    const find = {
      where: {
        addresserUser: {
          ...(email && { email }),
          ...(userIds && {
            id: In(userIds),
          }),
        },
        status: EnumNetworkingConnectionRequestStatus.Pending,
        addresseeUser: {
          id: reqUserId,
        },
      },
      relations: ['addresserUser', 'addresseeUser'],
      select: {
        addresserUser: {
          id: true,
          email: true,
        },
        addresseeUser: {
          id: true,
          email: true,
        },
      },
    };

    const userConnectionsRequestFind = userIds
      ? await this.find(find)
      : email
      ? compact([await this.findOne(find)])
      : null;

    return userConnectionsRequestFind;
  }

  async findSocialConnectionRequestByStatus({
    fromEmail,
    toEmail,
    status,
  }: {
    fromEmail: string;
    toEmail: string;
    status: EnumNetworkingConnectionRequestStatus[];
  }) {
    return this.socialConnectionRequestRepository
      .createQueryBuilder('socialConnectionRequest')
      .setParameters({ fromEmail, toEmail })
      .leftJoinAndSelect(
        'socialConnectionRequest.addresserUser',
        'addresserUser',
      )
      .leftJoinAndSelect(
        'socialConnectionRequest.addresseeUser',
        'addresseeUser',
      )
      .where('socialConnectionRequest.status IN(:...status)', {
        status,
      })
      .andWhere('addresserUser.email = :fromEmail')
      .andWhere(
        new Brackets((qb) => {
          qb.where('addresseeUser.email = :toEmail').orWhere(
            'socialConnectionRequest.tempAddresseeEmail = :toEmail',
          );
        }),
      )
      .getOne();
  }

  async getListSearchBuilder({
    search,
    status,
    addresseeEmail,
    extraDataForaddresserUser = false,
  }: ISocialConnectionRequestSearch): Promise<
    SelectQueryBuilder<SocialConnectionRequest>
  > {
    const builder = this.socialConnectionRequestRepository
      .createQueryBuilder('socialConnectionRequest')
      .leftJoinAndSelect(
        'socialConnectionRequest.addresseeUser',
        'addresseeUser',
      )
      .leftJoinAndSelect(
        'socialConnectionRequest.addresserUser',
        'addresserUser',
      )
      .setParameters({ status, addresseeEmail })
      .where(
        new Brackets((qb) => {
          qb.where('addresseeUser.email = :addresseeEmail').orWhere(
            'socialConnectionRequest.tempAddresseeEmail = :addresseeEmail',
          );
        }),
      );

    if (extraDataForaddresserUser) {
      builder.leftJoinAndSelect(
        'addresserUser.profile',
        'addresserUserProfile',
      );
    }

    if (status?.length) {
      builder.andWhere('socialConnectionRequest.status = ANY(:status)', {
        status,
      });
    }

    if (search) {
      builder.setParameters({ search, likeSearch: `%${search}%` });
      builder.andWhere('addresserUser.email ILIKE :likeSearch');
    }

    return builder;
  }

  async getTotal({
    status,
    search,
    addresseeEmail,
  }: ISocialConnectionRequestSearch): Promise<number> {
    const searchBuilder = await this.getListSearchBuilder({
      search,
      status,
      addresseeEmail,
    });

    return searchBuilder.getCount();
  }

  async paginatedSearchBy({
    status,
    search,
    addresseeEmail,
    options,
  }: ISocialConnectionRequestSearch): Promise<SocialConnectionRequest[]> {
    const searchBuilder = await this.getListSearchBuilder({
      extraDataForaddresserUser: true,
      search,
      status,
      addresseeEmail,
    });

    if (options.order) {
      searchBuilder.orderBy(options.order);
    }

    if (isNumber(options.take) && isNumber(options.skip)) {
      searchBuilder.take(options.take).skip(options.skip);
    }

    return searchBuilder.getMany();
  }
}
