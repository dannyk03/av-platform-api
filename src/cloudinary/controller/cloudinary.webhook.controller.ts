import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
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
import { HelperHashService } from '@/utils/helper/service';

import { CloudinaryWebhookSignature } from '../decorator';

@Controller({
  version: VERSION_NEUTRAL,
  path: 'cloudinary',
})
export class CloudinaryWebhookController {
  constructor(
    private readonly productImageService: ProductImageService,
    private readonly configService: ConfigService,
    private readonly helperHashService: HelperHashService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @CloudinaryWebhookSignature()
  @Post()
  async notify(
    @Body()
    body: {
      api_key: string;
      asset_id: string;
      moderation_kind?: string;
      notification_type: string;
      moderation_status?: EnumUploadFileMalwareDetectionStatus;
    },
  ): Promise<void> {
    if (body.notification_type === EnumCloudinaryNotificationType.Moderation) {
      if (body.moderation_kind === EnumCloudinaryModeration.PerceptionPoint) {
        if (
          body.moderation_status ===
          EnumUploadFileMalwareDetectionStatus.Approved
        ) {
          // Update image malware detection status
          await this.productImageService.updateImageMalwareDetectionStatus({
            assetId: body.asset_id,
            malwareDetectionStatus: body.moderation_status,
          });
        } else if (
          body.moderation_status ===
          EnumUploadFileMalwareDetectionStatus.Rejected
        ) {
          // Delete infected product image
          await this.productImageService.removeByAssetId({
            assetId: body.asset_id,
          });
        }
      }
    }
  }
}
