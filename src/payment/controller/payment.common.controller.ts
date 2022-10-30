import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import {
  EnumCurrency,
  EnumGiftOrderStatusCodeError,
  EnumPaymentStatusCodeError,
  IResponseData,
} from '@avo/type';

import { DataSource } from 'typeorm';

import { GiftOrder } from '@/order/entity';
import { User } from '@/user/entity';

import { PaymentService } from '../service';
import { StripeService } from '../stripe/service';
import { GiftOrderService } from '@/order/service';

import { LogTrace } from '@/log/decorator';
import { ReqUser } from '@/user/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';

import { PaymentCreateDto } from '../dto';

import { ConnectionNames } from '@/database/constant';
import { EnumLogAction } from '@/log/constant';

@Controller({
  version: '1',
})
export class PaymentCommonController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly paymentService: PaymentService,
    private readonly stripeService: StripeService,
    private readonly giftOrderService: GiftOrderService,
  ) {}

  @ClientResponse('payment.create')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.CreatePayment, {
    tags: ['payment', 'stripe', 'checkout', 'create'],
  })
  @AclGuard()
  @Post('/create')
  async createPaymentIntent(
    @ReqUser()
    { id: reqUserId }: User,
    @Body()
    { giftOrderId }: PaymentCreateDto,
  ): Promise<IResponseData> {
    const giftOrder = await this.giftOrderService.findUsersGiftOrderForPayment({
      userId: reqUserId,
      giftOrderId,
    });

    if (!giftOrder) {
      throw new NotFoundException({
        statusCode: EnumGiftOrderStatusCodeError.GiftOrderNotFoundError,
        message: 'gift.order.error.notFound',
      });
    }

    if (!giftOrder?.giftIntent.submittedAt) {
      throw new UnprocessableEntityException({
        statusCode:
          EnumPaymentStatusCodeError.PaymentGiftIntentNotSubmittedError,
        message: 'payment.error.giftIntentNotSubmitted',
      });
    }

    try {
      const senderUser = giftOrder?.giftIntent?.sender?.user;
      let stripePaymentIntentId = giftOrder?.stripePaymentIntentId;
      let stripeCustomerId = senderUser?.stripe?.customerId;

      if (!stripePaymentIntentId) {
        // New PaymentIntent
        if (!stripeCustomerId) {
          const stripeCustomer = await this.stripeService.createStripeCustomer({
            email: senderUser.email,
            name: `${senderUser?.profile?.firstName} ${senderUser?.profile?.lastName}`,
          });

          const createStripePayment = await this.stripeService.create({
            customerId: stripeCustomer?.id,
            user: senderUser,
          });

          const saveStripePayment = await this.stripeService.save(
            createStripePayment,
          );

          stripeCustomerId = saveStripePayment.customerId;
        }

        const giftAmountToBeCharged =
          await this.paymentService.calculateGiftAmountToBeCharged({
            giftIntent: giftOrder.giftIntent,
          });

        const paymentIntent =
          await this.stripeService.createStripePaymentIntent({
            amount: giftAmountToBeCharged,
            currency: EnumCurrency.USD.toLowerCase(),
            customer: stripeCustomerId,
            receipt_email: giftOrder.giftIntent.sender.user.email,
          });

        await this.defaultDataSource
          .getRepository(GiftOrder)
          .createQueryBuilder()
          .update({ stripePaymentIntentId: paymentIntent.id })
          .where('id = :orderId', { orderId: giftOrder.id })
          .execute();

        stripePaymentIntentId = paymentIntent.id;

        return {
          clientSecret: paymentIntent.client_secret,
        };
      }
      // Existing PaymentIntent
      const existingPaymentIntent =
        await this.stripeService.retrieveStripePaymentIntentById(
          stripePaymentIntentId,
        );
      return {
        clientSecret: existingPaymentIntent.client_secret,
      };
    } catch (error) {
      throw new UnprocessableEntityException({
        statusCode: EnumPaymentStatusCodeError.PaymentUnprocessableError,
        message: 'payment.error.unprocessable',
        error,
      });
    }
  }
}
