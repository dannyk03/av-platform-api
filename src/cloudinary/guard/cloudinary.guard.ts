import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  EnumCloudinaryNotificationType,
  EnumWebhookCodeError,
} from '@avo/type';

import StringifyWithFloats from 'stringify-with-floats';

import { CloudinaryService } from '../service';

import { IRequestApp } from '@/utils/request/type';

@Injectable()
export class CloudinarySignatureGuard implements CanActivate {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest<IRequestApp>();
    const { body } = request;
    const { notification_type } = body;

    console.log({
      CloudinarySignatureGuard: 'CloudinarySignatureGuard',
      request,
    });

    const xCldSignature = request.get('x-cld-signature');
    const xCldTimestamp = request.get('x-cld-timestamp');

    const bodyString =
      notification_type === EnumCloudinaryNotificationType.Moderation
        ? StringifyWithFloats({
            waiting_to_finish: 'float',
            confidence: 'float',
            status_code: 'float',
            urls_count: 'float',
            vt_positives: 'float',
            size: 'float',
            webroot_reputation: 'float',
            waiting_for_es: 'float',
            timestamp: 'float',
            unpacking_duration: 'float',
            scan_duration: 'float',
            scan_remote_duration: 'float',
            scan_self_duration: 'float',
            scan_finish_duration: 'float',
            decisions_duration: 'float',
            scan_queue_duration: 'float',
            scan_local_duration: 'float',
          })(body)
        : JSON.stringify(body);

    // The desired time in seconds for considering the request valid
    const validFor = 3600;

    const isValidSignature =
      await this.cloudinaryService.verifyNotificationSignature({
        body: bodyString,
        signature: xCldSignature,
        timestamp: xCldTimestamp,
        validFor,
      });

    if (!isValidSignature) {
      throw new UnauthorizedException({
        statusCode: EnumWebhookCodeError.WebhookUnauthorizedError,
        message: 'webhook.error.cloudinary.invalidSignature',
      });
    }

    return true;
  }
}
