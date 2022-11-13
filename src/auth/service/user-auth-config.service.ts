import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import {
  DataSource,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';

import { UserAuthConfig } from '../entity';

import { HelperDateService } from '@/utils/helper/service';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class UserAuthConfigService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    @InjectRepository(UserAuthConfig, ConnectionNames.Default)
    private userAuthConfigRepository: Repository<UserAuthConfig>,
    private helperDateService: HelperDateService,
  ) {}

  async create(props: DeepPartial<UserAuthConfig>): Promise<UserAuthConfig> {
    return this.userAuthConfigRepository.create(props);
  }

  async save(data: UserAuthConfig): Promise<UserAuthConfig> {
    return this.userAuthConfigRepository.save<UserAuthConfig>(data);
  }

  async findOneBy(
    find: FindOptionsWhere<UserAuthConfig>,
  ): Promise<UserAuthConfig> {
    return this.userAuthConfigRepository.findOneBy(find);
  }

  async findOne(find: FindOneOptions<UserAuthConfig>): Promise<UserAuthConfig> {
    return this.userAuthConfigRepository.findOne(find);
  }

  async setUserPhoneNumberVerified({
    phoneNumber,
  }: {
    phoneNumber: string;
  }): Promise<UserAuthConfig> {
    return this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const findUserAuthConfig = await transactionalEntityManager.findOne(
          UserAuthConfig,
          {
            where: {
              user: {
                phoneNumber,
              },
            },
            relations: {
              user: true,
            },
            select: {
              id: true,
              phoneVerifiedAt: true,
              user: {
                id: true,
                phoneNumber: true,
              },
            },
          },
        );

        findUserAuthConfig.phoneVerifiedAt = this.helperDateService.create();
        return transactionalEntityManager.save(findUserAuthConfig);
      },
    );
  }
}
