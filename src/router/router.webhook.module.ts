import { Module } from '@nestjs/common';

import { ProductImageModule } from '@/catalog/product-image/product-image.module';
import { OrderModule } from '@/order/order.module';
import { PaymentModule } from '@/payment/payment.module';

import { CloudinaryWebhookController } from '@/cloudinary/controller';
import { StripeWebhookController } from '@/payment/stripe/controller/stripe.webhook.controller';

@Module({
  controllers: [CloudinaryWebhookController, StripeWebhookController],
  providers: [],
  exports: [],
  imports: [ProductImageModule, PaymentModule, OrderModule],
})
export class RouterWebhookModule {}
