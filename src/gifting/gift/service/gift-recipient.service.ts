import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
  FindOneOptions,
} from 'typeorm';
// Services
import { DebuggerService } from '@/debugger/service';
// Entities
import { GiftRecipient } from '../entity';
//
import { ConnectionNames } from '@/database';

@Injectable()
export class GiftRecipientService {
  constructor(
    @InjectRepository(GiftRecipient, ConnectionNames.Default)
    private giftRecipientRepository: Repository<GiftRecipient>,
    private readonly configService: ConfigService,
    private readonly debuggerService: DebuggerService,
  ) {}

  async create(props: DeepPartial<GiftRecipient>): Promise<GiftRecipient> {
    return this.giftRecipientRepository.create(props);
  }

  async save(props: GiftRecipient): Promise<GiftRecipient> {
    return this.giftRecipientRepository.save(props);
  }

  async saveBulk(props: GiftRecipient[]): Promise<GiftRecipient[]> {
    return this.giftRecipientRepository.save(props);
  }

  async findOne(find: FindOneOptions<GiftRecipient>): Promise<GiftRecipient> {
    return this.giftRecipientRepository.findOne(find);
  }

  async findOneBy(
    find: FindOptionsWhere<GiftRecipient>,
  ): Promise<GiftRecipient> {
    return this.giftRecipientRepository.findOneBy(find);
  }
}
