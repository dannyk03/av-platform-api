import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  Req,
} from '@nestjs/common';

import { EnumWebhookCodeError } from '@avo/type';

import { StripeService } from '../service/stripe.service';

import { LogTrace } from '@/log/decorator';
import { RequestExcludeTimestampCheck } from '@/utils/request/decorator';

import { IRequestApp } from '@/utils/request/type';

import { EnumLogAction } from '@/log/constant';

@Controller('stripe')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @LogTrace(EnumLogAction.StripeWebhook, {
    tags: ['webhook', 'stripe'],
  })
  @RequestExcludeTimestampCheck()
  @Post()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: IRequestApp,
  ): Promise<void> {
    if (!signature) {
      throw new BadRequestException({
        statusCode: EnumWebhookCodeError.WebhookInvalidSignature,
        message: 'webhook.error.invalidSignature',
        error: 'Stripe webhook missing signature',
      });
    }

    const event = await this.stripeService.constructEventFromPayload(
      signature,
      request.rawBody,
    );

    try {
      await this.stripeService.createEvent(event.request.idempotency_key);
    } catch (error) {
      throw new BadRequestException({
        statusCode: EnumWebhookCodeError.WebhookEventIdempotencyError,
        message: 'webhook.error.idempotency',
        error: `Stripe event has already been processed. id:${event.id}`,
      });
    }
    this.stripeService.processWebhookEvent(event);
  }
}
