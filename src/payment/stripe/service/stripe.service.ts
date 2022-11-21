import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import Stripe from 'stripe';
import {
  DataSource,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { StripePayment } from '../entity';
import StripeWebhookEvent from '../entity/stripe-webhook-event.entity';
import { GiftIntent } from '@/gifting/entity';

import { GiftOrderService } from '@/order/service';
import { HelperDateService } from '@/utils/helper/service';

import { InjectStripe } from '../decorator';

import { ConnectionNames } from '@/database/constant';
import { EnumPaymentIntentStatus } from '@/order/order.constants';

@Injectable()
export class StripeService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    @InjectStripe()
    private readonly stripeClient: Stripe,
    @InjectRepository(StripePayment, ConnectionNames.Default)
    private stripePaymentRepository: Repository<StripePayment>,
    @InjectRepository(StripeWebhookEvent)
    private stripeWebhookEventRepository: Repository<StripeWebhookEvent>,
    private readonly helperDateService: HelperDateService,
    private readonly configService: ConfigService,
    private readonly giftOrderService: GiftOrderService,
  ) {}

  async create(props: DeepPartial<StripePayment>): Promise<StripePayment> {
    return this.stripePaymentRepository.create(props);
  }

  async createMany(
    props: DeepPartial<StripePayment>[],
  ): Promise<StripePayment[]> {
    return this.stripePaymentRepository.create(props);
  }

  async save(user: StripePayment): Promise<StripePayment> {
    return this.stripePaymentRepository.save<StripePayment>(user);
  }

  async findOne(find?: FindOneOptions<StripePayment>): Promise<StripePayment> {
    return this.stripePaymentRepository.findOne({ ...find });
  }

  async findOneBy(
    find?: FindOptionsWhere<StripePayment>,
  ): Promise<StripePayment> {
    return this.stripePaymentRepository.findOneBy({ ...find });
  }

  async createStripeCustomer(
    params: Stripe.CustomerCreateParams,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    return await this.stripeClient.customers.create(params);
  }

  async createStripePaymentIntent(
    params: Stripe.PaymentIntentCreateParams,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return await this.stripeClient.paymentIntents.create(params);
  }

  async retrieveStripePaymentIntentById(
    id: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return await this.stripeClient.paymentIntents.retrieve(id);
  }

  async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecretKey = this.configService.get<string>(
      'stripe.webhookSecretKey',
    );

    return this.stripeClient.webhooks.constructEvent(
      payload,
      signature,
      webhookSecretKey,
    );
  }

  createEvent(id: string) {
    return this.stripeWebhookEventRepository.insert({ id });
  }

  async processWebhookEvent(event: Stripe.Event) {
    const intent = event?.data?.object as Stripe.PaymentIntent;
    let status: EnumPaymentIntentStatus = null;
    switch (event['type']) {
      case EnumPaymentIntentStatus.Succeeded:
        status = EnumPaymentIntentStatus.Succeeded;
        break;
      case EnumPaymentIntentStatus.PaymentFailed:
        status = EnumPaymentIntentStatus.PaymentFailed;
        break;
      case EnumPaymentIntentStatus.Processing:
        status = EnumPaymentIntentStatus.Processing;
        break;
      case EnumPaymentIntentStatus.Canceled:
        status = EnumPaymentIntentStatus.Canceled;
        break;
      case EnumPaymentIntentStatus.RequiresAction:
        status = EnumPaymentIntentStatus.RequiresAction;
        break;
      case EnumPaymentIntentStatus.PartiallyFunded:
        status = EnumPaymentIntentStatus.PartiallyFunded;
        break;
      case EnumPaymentIntentStatus.AmountCapturableUpdated:
        status = EnumPaymentIntentStatus.AmountCapturableUpdated;
        break;
      case EnumPaymentIntentStatus.Created:
        status = EnumPaymentIntentStatus.Created;
        break;
    }

    if (intent?.id && status) {
      if (status === EnumPaymentIntentStatus.Succeeded) {
        const giftOrder = await this.giftOrderService.findOne({
          where: {
            stripePaymentIntentId: intent.id,
          },
          relations: ['giftIntent'],
        });
        await this.defaultDataSource.transaction(
          'SERIALIZABLE',
          async (transactionalEntityManager) => {
            await transactionalEntityManager.update(
              GiftIntent,
              { id: giftOrder.giftIntent.id },
              { paidAt: this.helperDateService.create() },
            );
          },
        );
      }
      await this.giftOrderService.updatePaymentStatus({
        stripePaymentIntentId: intent.id,
        paymentStatus: status,
      });
    }
  }
}
