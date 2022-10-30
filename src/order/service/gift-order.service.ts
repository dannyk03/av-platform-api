import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { GiftOrder } from '../entity';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class GiftOrderService {
  constructor(
    @InjectRepository(GiftOrder, ConnectionNames.Default)
    private readonly giftOrderRepository: Repository<GiftOrder>,
  ) {}

  async create(props: DeepPartial<GiftOrder>): Promise<GiftOrder> {
    return this.giftOrderRepository.create(props);
  }

  async createMany(props: DeepPartial<GiftOrder>[]): Promise<GiftOrder[]> {
    return this.giftOrderRepository.create(props);
  }

  async findOne(find?: FindOneOptions<GiftOrder>): Promise<GiftOrder> {
    return this.giftOrderRepository.findOne({ ...find });
  }

  async findOneBy(find?: FindOptionsWhere<GiftOrder>): Promise<GiftOrder> {
    return this.giftOrderRepository.findOneBy({ ...find });
  }
}
