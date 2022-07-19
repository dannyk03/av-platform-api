import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
  FindOneOptions,
} from 'typeorm';
// Entities
import { Gift } from '../entity';
//
import { ConnectionNames } from '@/database';
import { plainToInstance } from 'class-transformer';
import {
  RecipientAdditionalDataSerialization,
  SenderAdditionalDataSerialization,
} from '../serialization';

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(Gift, ConnectionNames.Default)
    private GifSendRepository: Repository<Gift>,
  ) {}

  async create(props: DeepPartial<Gift>): Promise<Gift> {
    return this.GifSendRepository.create(props);
  }

  async save(props: Gift): Promise<Gift> {
    return this.GifSendRepository.save(props);
  }

  async saveBulk(props: Gift[]): Promise<Gift[]> {
    return this.GifSendRepository.save(props);
  }

  async findOne(find: FindOneOptions<Gift>): Promise<Gift> {
    return this.GifSendRepository.findOne(find);
  }

  async findOneBy(find: FindOptionsWhere<Gift>): Promise<Gift> {
    return this.GifSendRepository.findOneBy(find);
  }

  async serializationSenderGiftAdditionalData(data: any): Promise<any> {
    return plainToInstance(SenderAdditionalDataSerialization, data);
  }
  async serializationRecipientGiftAdditionalData(data: any): Promise<any> {
    return plainToInstance(RecipientAdditionalDataSerialization, data);
  }
}
