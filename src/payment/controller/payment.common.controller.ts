import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { Action, Subjects } from '@avo/casl';

import { DataSource } from 'typeorm';

import { StripeService } from '../stripe/service';

import { LogTrace } from '@/log/decorator';

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
    private readonly stripeService: StripeService,
  ) {}

  // @ClientResponse('payment.create')
  // @HttpCode(HttpStatus.OK)
  // @LogTrace(EnumLogAction.CreatePayment, {
  //   tags: ['payment', 'create'],
  // })
  // @AclGuard({
  //   abilities: [
  //     {
  //       action: Action.Create,
  //       subject: Subjects.Organization,
  //     },
  //     {
  //       action: Action.Create,
  //       subject: Subjects.User,
  //     },
  //   ],
  //   systemOnly: true,
  // })
  // @Post('/create')
  // async create(
  //   @Body()
  //   { orderId: orderId }: PaymentCreateDto,
  // ): Promise<string> {
  //   console.log(`The order id to create a payment to is: ${orderId}`);
  //   try {
  //     // getting the order details from the db
  //     const order = { totalPrice: 100, currency: 'USD' };

  //     // getting the customer stripe id
  //     const customerId = '123';

  //     const clientSecret = await this.stripeService.createPaymentIntent({
  //       amount: order.totalPrice,
  //       currency: order.currency,
  //       customerID: customerId,
  //     });

  //     // return clientSecret;
  //   } catch (err) {
  //     console.log(
  //       `Error occurred during payment intent creation for order: ${orderId}.`,
  //       err,
  //     );
  //   }
  // }
}
