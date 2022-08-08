import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { GiftIntentConfirmationLink } from '../entity';

import { HelperHashService } from '@/utils/helper/service';

import { ConnectionNames } from '@/database';

@Injectable()
export class GiftSendConfirmationLinkService {
  constructor(
    @InjectRepository(GiftIntentConfirmationLink, ConnectionNames.Default)
    private giftSendVerificationLink: Repository<GiftIntentConfirmationLink>,
    private readonly helperHashService: HelperHashService,
  ) {}

  async create(
    props: DeepPartial<Omit<GiftIntentConfirmationLink, 'code'>>,
  ): Promise<GiftIntentConfirmationLink> {
    return this.giftSendVerificationLink.create({
      ...props,
      code: await this.helperHashService.magicCode(),
    });
  }

  async save(
    data: GiftIntentConfirmationLink,
  ): Promise<GiftIntentConfirmationLink> {
    return this.giftSendVerificationLink.save<GiftIntentConfirmationLink>(data);
  }

  async findOneBy(
    find: FindOptionsWhere<GiftIntentConfirmationLink>,
  ): Promise<GiftIntentConfirmationLink> {
    return this.giftSendVerificationLink.findOneBy(find);
  }

  async findOne(
    find: FindOneOptions<GiftIntentConfirmationLink>,
  ): Promise<GiftIntentConfirmationLink> {
    return this.giftSendVerificationLink.findOne(find);
  }
}
