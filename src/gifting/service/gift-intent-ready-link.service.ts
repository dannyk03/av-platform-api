import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { GiftIntentReadyLink } from '../entity';

import { HelperHashService } from '@/utils/helper/service';

import { ConnectionNames } from '@/database';

@Injectable()
export class GiftIntentReadyLinkService {
  constructor(
    @InjectRepository(GiftIntentReadyLink, ConnectionNames.Default)
    private giftIntentVerificationLinkRepository: Repository<GiftIntentReadyLink>,
    private readonly helperHashService: HelperHashService,
  ) {}

  async create(
    props: DeepPartial<Omit<GiftIntentReadyLink, 'code'>>,
  ): Promise<GiftIntentReadyLink> {
    return this.giftIntentVerificationLinkRepository.create({
      ...props,
      code: await this.helperHashService.magicCode(),
    });
  }

  async save(data: GiftIntentReadyLink): Promise<GiftIntentReadyLink> {
    return this.giftIntentVerificationLinkRepository.save<GiftIntentReadyLink>(
      data,
    );
  }

  async findOneBy(
    find: FindOptionsWhere<GiftIntentReadyLink>,
  ): Promise<GiftIntentReadyLink> {
    return this.giftIntentVerificationLinkRepository.findOneBy(find);
  }

  async findOne(
    find: FindOneOptions<GiftIntentReadyLink>,
  ): Promise<GiftIntentReadyLink> {
    return this.giftIntentVerificationLinkRepository.findOne(find);
  }
}
