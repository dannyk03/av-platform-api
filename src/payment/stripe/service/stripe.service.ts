import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Stripe from 'stripe';

@Injectable()
export class CustomerIOService {
  private readonly client: Stripe;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.client = new Stripe(
      this.configService.get<string>('stripe.secretKey'),
      {
        apiVersion: '2020-08-27',
      },
    );
  }
}
