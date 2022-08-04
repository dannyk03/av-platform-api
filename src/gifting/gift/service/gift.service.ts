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
    private GifIntentRepository: Repository<GiftIntent>,
  ) {}

  async create(props: DeepPartial<GiftIntent>): Promise<GiftIntent> {
    return this.GifIntentRepository.create(props);
  }

  async save(props: GiftIntent): Promise<GiftIntent> {
    return this.GifIntentRepository.save(props);
  }

  async saveBulk(props: GiftIntent[]): Promise<GiftIntent[]> {
    return this.GifIntentRepository.save(props);
  }

  async findOne(find: FindOneOptions<GiftIntent>): Promise<GiftIntent> {
    return this.GifIntentRepository.findOne(find);
  }

  async findOneBy(find: FindOptionsWhere<GiftIntent>): Promise<GiftIntent> {
    return this.GifIntentRepository.findOneBy(find);
  }

  async getListSearchBuilder({
    search,
  }: IGiftIntentSearch): Promise<SelectQueryBuilder<GiftIntent>> {
    const builder = this.GifIntentRepository.createQueryBuilder('giftIntent')
      .leftJoinAndSelect('giftIntent.recipient', 'recipient')
      .leftJoinAndSelect('giftIntent.sender', 'sender')
      .leftJoinAndSelect('recipient.user', 'recipientUser')
      .leftJoinAndSelect('sender.user', 'senderUser');

    if (search) {
      builder.andWhere(
        new Brackets((qb) => {
          builder.setParameters({ search, likeSearch: `%${search}%` });
          qb.where('senderUser.email ILIKE :likeSearch')
            .orWhere('recipientUser.email ILIKE :likeSearch')
            .orWhere('senderUser.email ILIKE :likeSearch')
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
