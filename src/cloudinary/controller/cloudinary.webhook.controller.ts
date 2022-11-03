import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  EnumCloudinaryModeration,
  EnumCloudinaryNotificationType,
  EnumUploadFileMalwareDetectionStatus,
  EnumWebhookCodeError,
} from '@avo/type';

import { ProductImageService } from '@/catalog/product-image/service';

@Controller({
  version: VERSION_NEUTRAL,
  path: 'cloudinary',
})
export class CloudinaryWebhookController {
  constructor(
    private readonly productImageService: ProductImageService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async notify(
    @Body()
    {
      api_key,
      asset_id,
      moderation_kind,
      notification_type,
      moderation_status,
    }: {
      api_key: string;
      asset_id: string;
      moderation_kind: string;
      notification_type: string;
      moderation_status: EnumUploadFileMalwareDetectionStatus;
    },
  ): Promise<void> {
    const cloudinaryApiKey = this.configService.get<string>(
      'cloudinary.credentials.key',
    );
    if (api_key && api_key !== cloudinaryApiKey) {
      throw new UnauthorizedException({
        statusCode: EnumWebhookCodeError.WebhookUnauthorizedError,
        message: 'webhook.error.unauthorized',
      });
    }

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
