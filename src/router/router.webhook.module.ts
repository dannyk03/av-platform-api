import { Module } from '@nestjs/common';

import { ProductImageModule } from '@/catalog/product-image/product-image.module';

import { CloudinaryWebhookController } from '@/cloudinary/controller';

@Module({
  controllers: [CloudinaryWebhookController],
  providers: [],
  exports: [],
  imports: [ProductImageModule],
})
export class RouterWebhookModule {}
