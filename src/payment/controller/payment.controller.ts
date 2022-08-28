import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { Action, Subjects } from '@avo/casl';
import { EnumOrganizationStatusCodeError } from '@avo/type';

import { EnumOrganizationRole } from '@acl/role';
import { DataSource } from 'typeorm';

import { AuthService } from '@/auth/service';
import { UserService } from '@/user/service';
import { AclRolePresetService, AclRoleService } from '@acl/role/service';

import { LogTrace } from '@/log/decorator';

import { AclGuard } from '@/auth/guard';

import { PaymentCreateDto } from '../dto';

import { ConnectionNames } from '@/database/constant';
import { EnumLogAction } from '@/log/constant';

import { StripeService } from '../stripe';

@Controller({
  version: '1',
  path: 'payment',
})
export class PaymentController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly stripeService: StripeService,
  ) {}

  // @ClientResponse('payment.create')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.CreatePayment, {
    tags: ['payment', 'create'],
  })
  @AclGuard({
    abilities: [
      {
        action: Action.Create,
        subject: Subjects.Organization,
      },
      {
        action: Action.Create,
        subject: Subjects.User,
      },
    ],
    systemOnly: true,
  })
  @Post('/create')
  async create(
    @Body()
    { orderId: orderId }: PaymentCreateDto,
  ): Promise<string> {
    console.log(`The order id to create a payment to is: ${orderId}`);
    try {
      // getting the order details from the db
      const order = { totalPrice: 100, currency: 'USD' };

      // getting the customer stripe id
      const customerId = '123';

      const clientSecret = await this.stripeService.createPaymentIntent({
        amount: order.totalPrice,
        currency: order.currency,
        customerID: customerId,
      });

      return clientSecret;
    } catch (err) {
      console.log(
        `Error occurred during payment intent creation for order: ${orderId}.`,
        err,
      );
    }
  }
}
