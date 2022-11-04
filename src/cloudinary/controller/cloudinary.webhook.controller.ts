import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import {
  EnumCloudinaryModeration,
  EnumCloudinaryNotificationType,
  EnumUploadFileMalwareDetectionStatus,
} from '@avo/type';

import { ProductImageService } from '@/catalog/product-image/service';

import { CloudinaryWebhookSignature } from '../decorator';

@Controller({
  version: VERSION_NEUTRAL,
  path: 'cloudinary',
})
export class CloudinaryWebhookController {
  constructor(private readonly productImageService: ProductImageService) {}

  @HttpCode(HttpStatus.OK)
  @CloudinaryWebhookSignature()
  @Post()
  async notify(
    @Body()
    {
      asset_id,
      moderation_kind,
      notification_type,
      moderation_status,
    }: {
      asset_id: string;
      moderation_kind?: string;
      notification_type: string;
      moderation_status?: EnumUploadFileMalwareDetectionStatus;
    },
  ): Promise<void> {
    if (notification_type === EnumCloudinaryNotificationType.Moderation) {
      if (moderation_kind === EnumCloudinaryModeration.PerceptionPoint) {
        if (
          moderation_status === EnumUploadFileMalwareDetectionStatus.Approved
        ) {
          // Update image malware detection status
          await this.productImageService.updateImageMalwareDetectionStatus({
            assetId: asset_id,
            malwareDetectionStatus: moderation_status,
          });
        } else if (
          moderation_status === EnumUploadFileMalwareDetectionStatus.Rejected
        ) {
          // Delete infected product image
          await this.productImageService.removeByAssetId({
            assetId: asset_id,
          });
        }
      }
    }
  }
}
