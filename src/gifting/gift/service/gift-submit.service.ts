import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { GiftSubmit } from '../entity';

import { ConnectionNames } from '@/database';

@Injectable()
export class GiftSubmitService {
  constructor(
    @InjectRepository(GiftSubmit, ConnectionNames.Default)
    private giftSubmitRepository: Repository<GiftSubmit>,
  ) {}

  async create(props: DeepPartial<GiftSubmit>): Promise<GiftSubmit> {
    return this.giftSubmitRepository.create(props);
  }

  async save(data: GiftSubmit): Promise<GiftSubmit> {
    return this.giftSubmitRepository.save<GiftSubmit>(data);
  }

  async findOneBy(find: FindOptionsWhere<GiftSubmit>): Promise<GiftSubmit> {
    return this.giftSubmitRepository.findOneBy(find);
  }

  async findOne(find: FindOneOptions<GiftSubmit>): Promise<GiftSubmit> {
    return this.giftSubmitRepository.findOne(find);
  }
}
