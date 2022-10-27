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
  EnumGiftIntentStatusCodeError,
  EnumPaymentStatusCodeError,
} from '@avo/type';

import { DataSource } from 'typeorm';

import { User } from '@/user/entity';

import { PaymentService } from '../service';
import { StripeService } from '../stripe/service';
import { GiftIntentService } from '@/gifting/service';

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
    private readonly giftIntentService: GiftIntentService,
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
    { giftIntentId }: PaymentCreateDto,
  ): Promise<string> {
    const giftIntent = await this.giftIntentService.findOne({
      where: {
        id: giftIntentId,
        sender: {
          user: { id: reqUserId },
        },
      },
      relations: [
        'giftSubmit',
        'giftSubmit.gifts',
        'giftSubmit.gifts.products',
      ],
      // relations: {
      //   giftSubmit: {
      //     gifts: true,
      //   },
      // },
      select: {
        id: true,
        submittedAt: true,
        recipient: {
          user: {
            email: true,
            profile: {
              shipping: {
                addressLine1: true,
                addressLine2: true,
                city: true,
                country: true,
                state: true,
              },
            },
          },
        },
        sender: {
          user: {
            id: true,
            email: true,
          },
        },
        giftSubmit: {
          id: true,
          gifts: {
            products: {
              taxCode: true,
              price: true,
              shippingCost: true,
              displayOptions: {
                name: true,
                language: { isoCode: true },
              },
            },
          },
        },
      },
    });

    if (!giftIntent) {
      throw new NotFoundException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentNotFoundError,
        message: 'gift.intent.error.notFound',
      });
    }

    if (!giftIntent.submittedAt) {
      throw new UnprocessableEntityException({
        statusCode:
          EnumPaymentStatusCodeError.PaymentGiftIntentNotSubmittedError,
        message: 'payment.error.giftIntentNotSubmitted',
      });
    }

    try {
      const giftAmountToBeCharged =
        await this.paymentService.calculateGiftAmountToBeCharged({
          giftIntent,
        });

      const paymentIntent = await this.stripeService.createPaymentIntent({
        amount: giftAmountToBeCharged,
        currency: EnumCurrency.USD.toLowerCase(),
        // customer: giftIntent.sender.user.stripe.customerId,
        receipt_email: giftIntent.sender.user.email,
        confirm: true,
      });

      return paymentIntent.client_secret;
    } catch (error) {
      throw new UnprocessableEntityException({
        statusCode: EnumPaymentStatusCodeError.PaymentUnprocessableError,
        message: 'payment.error.unprocessable',
        error,
      });
    }
  }
}
