import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GiftIntent } from '@/gifting/entity';

@Injectable()
export class PaymentService {
  constructor(private readonly configService: ConfigService) {}

  //   Return value in cents
  async calculateGiftAmountToBeCharged({
    giftIntent,
  }: {
    giftIntent: GiftIntent;
  }): Promise<number> {
    return giftIntent?.giftSubmit?.gifts?.reduce(
      (previousValue, currentValue) => {
        return (
          previousValue +
          currentValue?.products?.reduce(
            // Multiply by 100 because Stripe expects to receive the amount in cents
            (previousValue, { price, shippingCost }) => {
              return (
                previousValue +
                (Number(price) * 100 + Number(shippingCost) * 100)
              );
            },
            0,
          )
        );
      },
      0,
    );
  }
}
