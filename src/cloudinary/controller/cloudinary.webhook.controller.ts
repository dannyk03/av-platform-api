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
import { LogService } from '@/log/service';

import { CloudinaryWebhookSignature } from '../decorator';
import { LogTrace } from '@/log/decorator';

import { EnumLogAction, EnumLogLevel } from '@/log/constant';

@Controller({
  version: VERSION_NEUTRAL,
  path: 'cloudinary',
})
export class CloudinaryWebhookController {
  constructor(
    private readonly productImageService: ProductImageService,
    private readonly logService: LogService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @LogTrace(
    ({ notification_type: notificationType }) =>
      notificationType == EnumCloudinaryNotificationType.Error
        ? EnumLogAction.CloudinaryWebhookError
        : EnumLogAction.CloudinaryWebhook,
    {
      level: ({ notification_type: notificationType }) =>
        notificationType == EnumCloudinaryNotificationType.Error &&
        EnumLogLevel.Error,
      tags: ['webhook', 'cloudinary'],
    },
  )
  @CloudinaryWebhookSignature()
  @Post()
  async notify(@Body() body: any): Promise<void> {
    const notificationType: EnumCloudinaryNotificationType =
      body.notification_type;

    console.log({ NOTIFICATION_TYPE: notificationType });

    if (notificationType === EnumCloudinaryNotificationType.Moderation) {
      const { moderation_kind, moderation_status, asset_id } = body;

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
