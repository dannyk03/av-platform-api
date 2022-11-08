import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';

import { GiftOrder } from '../entity';

import { EnumPaymentIntentStatus } from '../order.constants';
import { ConnectionNames } from '@/database/constant';

@Injectable()
export class GiftOrderService {
  constructor(
    @InjectRepository(GiftOrder, ConnectionNames.Default)
    private readonly giftOrderRepository: Repository<GiftOrder>,
  ) {}

  async create(props: DeepPartial<GiftOrder>): Promise<GiftOrder> {
    return this.giftOrderRepository.create(props);
  }

  async createMany(props: DeepPartial<GiftOrder>[]): Promise<GiftOrder[]> {
    return this.giftOrderRepository.create(props);
  }

  async save(user: GiftOrder): Promise<GiftOrder> {
    return this.giftOrderRepository.save<GiftOrder>(user);
  }

  async findOne(find?: FindOneOptions<GiftOrder>): Promise<GiftOrder> {
    return this.giftOrderRepository.findOne({ ...find });
  }

  async findOneBy(find?: FindOptionsWhere<GiftOrder>): Promise<GiftOrder> {
    return this.giftOrderRepository.findOneBy({ ...find });
  }

  async findUsersGiftOrderForPaymentCreation({
    userId,
    giftOrderId,
  }: {
    userId: string;
    giftOrderId: string;
  }): Promise<GiftOrder> {
    // TODO filter all unused DB columns
    const builder = this.giftOrderRepository
      .createQueryBuilder('giftOrder')
      .setParameters({ userId, giftOrderId })
      .where('giftOrder.id = :giftOrderId')
      .andWhere('senderUser.id = :userId')
      .leftJoinAndSelect('giftOrder.giftIntent', 'giftIntent')
      .leftJoinAndSelect('giftIntent.sender', 'sender')
      .leftJoinAndSelect('giftIntent.recipient', 'recipient')
      .leftJoinAndSelect('sender.user', 'senderUser')
      .leftJoinAndSelect('senderUser.stripe', 'senderUserStripe')
      .leftJoinAndSelect('recipient.user', 'recipientUser')
      .leftJoinAndSelect('recipientUser.profile', 'recipientUserProfile')
      .leftJoinAndSelect(
        'recipientUserProfile.shipping',
        'recipientUserProfileShipping',
      )
      .leftJoinAndSelect('giftIntent.giftSubmit', 'giftSubmit')
      .leftJoinAndSelect('giftSubmit.gifts', 'gifts')
      .leftJoinAndSelect('gifts.products', 'products');

    return builder.getOne();
  }

  async updatePaymentStatus({
    stripePaymentIntentId,
    paymentStatus,
  }: {
    stripePaymentIntentId: string;
    paymentStatus: EnumPaymentIntentStatus;
  }): Promise<UpdateResult> {
    return this.giftOrderRepository
      .createQueryBuilder()
      .update(GiftOrder)
      .set({ paymentStatus })
      .where('stripePaymentIntentId = :stripePaymentIntentId', {
        stripePaymentIntentId,
      })
      .execute();
  }
}
