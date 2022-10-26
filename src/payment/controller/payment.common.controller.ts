import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { Action, Subjects } from '@avo/casl';

import { DataSource } from 'typeorm';

import { StripeService } from '../stripe/service';

import { LogTrace } from '@/log/decorator';
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
    private readonly stripeService: StripeService,
  ) {}

  @ClientResponse('payment.create')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.CreatePayment, {
    tags: ['payment', 'stripe', 'create'],
  })
  @AclGuard()
  @Post('/create')
  async create(
    @Body()
    { giftIntentId }: PaymentCreateDto,
  ): Promise<string> {
    console.log(giftIntentId);
    return giftIntentId;
  }
}
