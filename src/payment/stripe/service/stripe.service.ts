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

import { InjectStripe } from '../decorator';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class StripeService {
  constructor(
    @InjectStripe()
    private readonly stripeClient: Stripe,
    @InjectRepository(StripePayment, ConnectionNames.Default)
    private stripePaymentRepository: Repository<StripePayment>,
    private readonly configService: ConfigService,
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
}
