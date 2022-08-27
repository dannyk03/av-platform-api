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

import { ConnectionNames } from '@/database/constants';

@Injectable()
export class GiftIntentConfirmationLinkService {
  constructor(
    @InjectRepository(GiftIntentConfirmationLink, ConnectionNames.Default)
    private giftIntentVerificationLink: Repository<GiftIntentConfirmationLink>,
    private readonly helperHashService: HelperHashService,
  ) {}

  async create(
    props: DeepPartial<Omit<GiftIntentConfirmationLink, 'code'>>,
  ): Promise<GiftIntentConfirmationLink> {
    return this.giftIntentVerificationLink.create({
      ...props,
      code: await this.helperHashService.magicCode(),
    });
  }

  async save(
    data: GiftIntentConfirmationLink,
  ): Promise<GiftIntentConfirmationLink> {
    return this.giftIntentVerificationLink.save<GiftIntentConfirmationLink>(
      data,
    );
  }

  async findOneBy(
    find: FindOptionsWhere<GiftIntentConfirmationLink>,
  ): Promise<GiftIntentConfirmationLink> {
    return this.giftIntentVerificationLink.findOneBy(find);
  }

  async findOne(
    find: FindOneOptions<GiftIntentConfirmationLink>,
  ): Promise<GiftIntentConfirmationLink> {
    return this.giftIntentVerificationLink.findOne(find);
  }
}
