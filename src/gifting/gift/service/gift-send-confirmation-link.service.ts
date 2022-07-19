import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
// Entities
import { GiftSendConfirmationLink } from '../entity';
// Services
import { HelperHashService } from '@/utils/helper/service';
//
import { ConnectionNames } from '@/database';

@Injectable()
export class GiftSendConfirmationLinkService {
  constructor(
    @InjectRepository(GiftSendConfirmationLink, ConnectionNames.Default)
    private giftSendVerificationLink: Repository<GiftSendConfirmationLink>,
    private readonly helperHashService: HelperHashService,
  ) {}

  async create(
    props: DeepPartial<Omit<GiftSendConfirmationLink, 'code'>>,
  ): Promise<GiftSendConfirmationLink> {
    return this.giftSendVerificationLink.create({
      ...props,
      code: this.helperHashService.code32char(),
    });
  }

  async save(
    data: GiftSendConfirmationLink,
  ): Promise<GiftSendConfirmationLink> {
    return this.giftSendVerificationLink.save<GiftSendConfirmationLink>(data);
  }

  async findOneBy(
    find: FindOptionsWhere<GiftSendConfirmationLink>,
  ): Promise<GiftSendConfirmationLink> {
    return this.giftSendVerificationLink.findOneBy(find);
  }

  async findOne(
    find: FindOneOptions<GiftSendConfirmationLink>,
  ): Promise<GiftSendConfirmationLink> {
    return this.giftSendVerificationLink.findOne(find);
  }
}
