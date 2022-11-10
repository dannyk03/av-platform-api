import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Gift } from '../entity';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(Gift, ConnectionNames.Default)
    private giftRepository: Repository<Gift>,
  ) {}

  async create(props: DeepPartial<Gift>): Promise<Gift> {
    return this.giftRepository.create(props);
  }

  async find(find?: FindManyOptions<Gift>): Promise<Gift[]> {
    return this.giftRepository.find(find);
  }

  async count(find?: FindManyOptions<Gift>): Promise<number> {
    return this.giftRepository.count(find);
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

  async deleteOneBy(find: FindOptionsWhere<Gift>): Promise<DeleteResult> {
    return this.giftRepository.delete(find);
  }
}
