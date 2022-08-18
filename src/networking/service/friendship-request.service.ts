import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumNetworkingConnectionRequestStatus } from '@avo/type';

import { plainToInstance } from 'class-transformer';
import { isNumber } from 'class-validator';
import {
  Brackets,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { FriendshipRequest } from '../entity';

import { ConnectRequestGetSerialization } from '../serialization';

import { IConnectRequestSearch } from '../networking.interface';

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

  async findFriendshipRequestByStatus({
    fromEmail,
    toEmail,
    status,
  }: {
    fromEmail: string;
    toEmail: string;
    status: EnumNetworkingConnectionRequestStatus[];
  }) {
    return this.friendshipRequestRepository
      .createQueryBuilder('friendshipRequest')
      .setParameters({ fromEmail, toEmail })
      .leftJoinAndSelect('friendshipRequest.addressedUser', 'addressedUser')
      .leftJoinAndSelect('friendshipRequest.addresseeUser', 'addresseeUser')
      .where('friendshipRequest.status IN(:...status)', {
        status,
      })
      .andWhere('addressedUser.email = :fromEmail')
      .andWhere(
        new Brackets((qb) => {
          qb.where('addresseeUser.email = :toEmail').orWhere(
            'friendshipRequest.tempAddresseeEmail = :toEmail',
          );
        }),
      )
      .getOne();
  }

  async getListSearchBuilder({
    search,
    status,
    addresseeEmail,
    extraDataForAddressedUser = false,
  }: IConnectRequestSearch): Promise<SelectQueryBuilder<FriendshipRequest>> {
    const builder = this.friendshipRequestRepository
      .createQueryBuilder('friendshipRequest')
      .leftJoinAndSelect('friendshipRequest.addresseeUser', 'addresseeUser')
      .leftJoinAndSelect('friendshipRequest.addressedUser', 'addressedUser')
      .setParameters({ status, addresseeEmail })
      .where(
        new Brackets((qb) => {
          qb.where('addresseeUser.email = :addresseeEmail').orWhere(
            'friendshipRequest.tempAddresseeEmail = :addresseeEmail',
          );
        }),
      );

    if (extraDataForAddressedUser) {
      builder.leftJoinAndSelect(
        'addressedUser.profile',
        'addressedUserProfile',
      );
    }

    if (status?.length) {
      builder.andWhere('friendshipRequest.status = ANY(:status)', { status });
    }

    if (search) {
      builder.setParameters({ search, likeSearch: `%${search}%` });
      builder.andWhere('addressedUser.email ILIKE :likeSearch');
    }

    return builder;
  }

  async getTotal({
    status,
    search,
    addresseeEmail,
  }: IConnectRequestSearch): Promise<number> {
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
  }: IConnectRequestSearch): Promise<FriendshipRequest[]> {
    const searchBuilder = await this.getListSearchBuilder({
      extraDataForAddressedUser: true,
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

  async serializationConnectionRequestList(
    data: FriendshipRequest[],
  ): Promise<ConnectRequestGetSerialization[]> {
    return plainToInstance(ConnectRequestGetSerialization, data);
  }

  async serializationConnectionRequest(
    data: FriendshipRequest,
  ): Promise<ConnectRequestGetSerialization> {
    return plainToInstance(ConnectRequestGetSerialization, data);
  }
}
