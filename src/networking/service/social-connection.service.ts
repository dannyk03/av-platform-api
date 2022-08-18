import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { SocialConnection } from '../entity';

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
}
