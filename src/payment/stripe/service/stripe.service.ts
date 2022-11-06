import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import Stripe from 'stripe';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { StripePayment } from '../entity';
import StripeWebhookEvent from '../entity/stripe-webhook-event.entity';

import { GiftOrderService } from '@/order/service';

import { InjectStripe } from '../decorator';

import { ConnectionNames } from '@/database/constant';
import { PaymentStatuses } from '@/order/order.constants';

@Injectable()
export class StripeService {
  constructor(
    @InjectStripe()
    private readonly stripeClient: Stripe,
    @InjectRepository(StripePayment, ConnectionNames.Default)
    private stripePaymentRepository: Repository<StripePayment>,
    @InjectRepository(StripeWebhookEvent)
    private stripeWebhookEventRepository: Repository<StripeWebhookEvent>,
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

  async getTaxAmount({ taxCode, recipientZipCode, basePrice }) {
    // ask stripe what is the tax for this product
    return 10;
  }

  async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>(
      'stripe.webhookSecret',
    );

    return this.stripeClient.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }

  createEvent(id: string) {
    return this.stripeWebhookEventRepository.insert({ id });
  }

  async processWebhookEvent(event: Stripe.Event) {
    let intent = null;
    let status: PaymentStatuses = null;
    switch (event['type']) {
      case 'payment_intent.succeeded':
        intent = event.data.object;
        status = PaymentStatuses.succeeded;
        console.log('Succeeded:', intent.id);
        break;
      case 'payment_intent.payment_failed':
        intent = event.data.object;
        status = PaymentStatuses.payment_failed;
        const message =
          intent.last_payment_error && intent.last_payment_error.message;
        console.log('Failed:', intent.id, message);
        break;
    }

    await this.giftOrderService.updatePaymentStatus({
      stripePaymentIntentId: intent.id,
      paymentStatus: status,
    });
  }
}
