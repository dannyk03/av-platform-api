import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  Req,
} from '@nestjs/common';

import { StripeService } from '../service/stripe.service';

@Controller('stripe')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request,
  ) {
    console.log(1111);
    console.log(request.rawBody);

    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = await this.stripeService.constructEventFromPayload(
      signature,
      request.rawBody,
    );

    try {
      await this.stripeService.createEvent(event.id);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('This event was already processed');
    }

    this.stripeService.processWebhookEvent(event);

    return event;
    // ...
  }
}
