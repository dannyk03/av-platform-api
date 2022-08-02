import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { GiftIntent } from '../entity';

import {
  RecipientAdditionalDataSerialization,
  SenderAdditionalDataSerialization,
} from '../serialization';

import { ConnectionNames } from '@/database';

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(GiftIntent, ConnectionNames.Default)
    private GifSendRepository: Repository<GiftIntent>,
  ) {}

  async create(props: DeepPartial<GiftIntent>): Promise<GiftIntent> {
    return this.GifSendRepository.create(props);
  }

  async save(props: GiftIntent): Promise<GiftIntent> {
    return this.GifSendRepository.save(props);
  }

  async saveBulk(props: GiftIntent[]): Promise<GiftIntent[]> {
    return this.GifSendRepository.save(props);
  }

  async findOne(find: FindOneOptions<GiftIntent>): Promise<GiftIntent> {
    return this.GifSendRepository.findOne(find);
  }

  async findOneBy(find: FindOptionsWhere<GiftIntent>): Promise<GiftIntent> {
    return this.GifSendRepository.findOneBy(find);
  }

  async serializationSenderGiftAdditionalData(data: any): Promise<any> {
    return plainToInstance(SenderAdditionalDataSerialization, data);
  }
  async serializationRecipientGiftAdditionalData(data: any): Promise<any> {
    return plainToInstance(RecipientAdditionalDataSerialization, data);
  }
}
