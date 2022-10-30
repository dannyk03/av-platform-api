import { Module } from '@nestjs/common';

import { GiftModule } from '@/gifting/gift.module';
import { OrderModule } from '@/order/order.module';
import { PaymentModule } from '@/payment/payment.module';
import { UserModule } from '@/user/user.module';

import { PaymentCommonController } from '@/payment/controller';

@Module({
  controllers: [PaymentCommonController],
  providers: [],
  exports: [],
  imports: [PaymentModule, UserModule, GiftModule, OrderModule],
})
export class RouterPaymentModule {}
