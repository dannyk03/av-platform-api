import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { isNumber } from 'class-validator';
import {
  Brackets,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { GiftIntent } from '../entity';

import {
  GiftIntentSerialization,
  RecipientAdditionalDataSerialization,
  SenderAdditionalDataSerialization,
} from '../serialization';

import { IGiftIntentSearch } from '../gift-intent.interface';

import { ConnectionNames } from '@/database';

@Injectable()
export class GiftIntentService {
  constructor(
    @InjectRepository(GiftIntent, ConnectionNames.Default)
    private gifIntentRepository: Repository<GiftIntent>,
  ) {}

  async create(props: DeepPartial<GiftIntent>): Promise<GiftIntent> {
    return this.gifIntentRepository.create(props);
  }

  async save(props: GiftIntent): Promise<GiftIntent> {
    return this.gifIntentRepository.save(props);
  }

  async saveBulk(props: GiftIntent[]): Promise<GiftIntent[]> {
    return this.gifIntentRepository.save(props);
  }

  async findOne(find: FindOneOptions<GiftIntent>): Promise<GiftIntent> {
    return this.gifIntentRepository.findOne(find);
  }

  async findOneBy(find: FindOptionsWhere<GiftIntent>): Promise<GiftIntent> {
    return this.gifIntentRepository.findOneBy(find);
  }

  async getListSearchBuilder({
    search,
    loadExtra = true,
  }: IGiftIntentSearch): Promise<SelectQueryBuilder<GiftIntent>> {
    const builder = this.gifIntentRepository
      .createQueryBuilder('giftIntent')
      .leftJoinAndSelect('giftIntent.additionalData', 'additionalData')
      .leftJoinAndSelect('giftIntent.recipient', 'recipient')
      .leftJoinAndSelect('giftIntent.sender', 'sender')
      .leftJoinAndSelect('recipient.user', 'recipientUser')
      .leftJoinAndSelect('sender.user', 'senderUser');

    if (loadExtra) {
      builder
        .leftJoinAndSelect('giftIntent.giftSubmit', 'giftSubmit')
        .leftJoinAndSelect('giftIntent.giftOptions', 'giftOptions');
    }

    if (search) {
      builder.andWhere(
        new Brackets((qb) => {
          builder.setParameters({ search, likeSearch: `%${search}%` });
          qb.where('senderUser.email ILIKE :likeSearch')
            .orWhere('recipientUser.email ILIKE :likeSearch')
            .orWhere(`recipient.additionalData ->> 'email' ILIKE :likeSearch`)
            .orWhere(`sender.additionalData ->> 'email' ILIKE :likeSearch`);
        }),
      );
    }

    return builder;
  }

  async paginatedSearchBy({
    search,
    options,
  }: IGiftIntentSearch): Promise<GiftIntent[]> {
    const searchBuilder = await this.getListSearchBuilder({
      search,
    });

    if (options.order) {
      searchBuilder.orderBy(options.order);
    }

    if (isNumber(options.take) && isNumber(options.skip)) {
      searchBuilder.take(options.take).skip(options.skip);
    }

    return searchBuilder.getMany();
  }

  async getTotal({ search }: IGiftIntentSearch): Promise<number> {
    const searchBuilder = await this.getListSearchBuilder({
      search,
      loadExtra: false,
    });

    return searchBuilder.getCount();
  }

  async serializationSenderGiftAdditionalData(data: any): Promise<any> {
    return plainToInstance(SenderAdditionalDataSerialization, data);
  }
  async serializationRecipientGiftAdditionalData(data: any): Promise<any> {
    return plainToInstance(RecipientAdditionalDataSerialization, data);
  }

  async serializationGiftIntentList(
    data: GiftIntent[],
  ): Promise<GiftIntentSerialization[]> {
    return plainToInstance(GiftIntentSerialization, data);
  }
}
