import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
  FindOneOptions,
} from 'typeorm';
// Entities
import { GiftSender } from '../entity';
//
import { ConnectionNames } from '@/database';

@Injectable()
export class GiftSenderService {
  constructor(
    @InjectRepository(GiftSender, ConnectionNames.Default)
    private giftSenderRepository: Repository<GiftSender>,
  ) {}

  async create(props: DeepPartial<GiftSender>): Promise<GiftSender> {
    return this.giftSenderRepository.create(props);
  }

  async save(props: GiftSender): Promise<GiftSender> {
    return this.giftSenderRepository.save(props);
  }

  async saveBulk(props: GiftSender[]): Promise<GiftSender[]> {
    return this.giftSenderRepository.save(props);
  }

  async findOne(find: FindOneOptions<GiftSender>): Promise<GiftSender> {
    return this.giftSenderRepository.findOne(find);
  }

  async findOneBy(find: FindOptionsWhere<GiftSender>): Promise<GiftSender> {
    return this.giftSenderRepository.findOneBy(find);
  }
}
