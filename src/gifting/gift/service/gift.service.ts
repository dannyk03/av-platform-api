import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Gift } from '../entity';

import { ConnectionNames } from '@/database';

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(Gift, ConnectionNames.Default)
    private giftRepository: Repository<Gift>,
  ) {}

  async create(props: DeepPartial<Gift>): Promise<Gift> {
    return this.giftRepository.create(props);
  }

  async save(props: Gift): Promise<Gift> {
    return this.giftRepository.save(props);
  }

  async saveBulk(props: Gift[]): Promise<Gift[]> {
    return this.giftRepository.save(props);
  }

  async findOne(find: FindOneOptions<Gift>): Promise<Gift> {
    return this.giftRepository.findOne(find);
  }

  async findOneBy(find: FindOptionsWhere<Gift>): Promise<Gift> {
    return this.giftRepository.findOneBy(find);
  }
}
