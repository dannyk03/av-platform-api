import { Module } from '@nestjs/common';

import { ProductImageModule } from '@/catalog/product-image/product-image.module';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

import { CloudinaryWebhookController } from '@/cloudinary/controller';

@Module({
  controllers: [CloudinaryWebhookController],
  providers: [],
  exports: [],
  imports: [ProductImageModule, CloudinaryModule],
})
export class RouterWebhookModule {}
