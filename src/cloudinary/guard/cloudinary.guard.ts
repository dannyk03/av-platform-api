import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  EnumCloudinaryNotificationType,
  EnumWebhookCodeError,
} from '@avo/type';

import StringifyWithFloats from 'stringify-with-floats';

import { CloudinaryService } from '../service';
import { HelperHashService } from '@/utils/helper/service';

import { IRequestApp } from '@/utils/request/type';

@Injectable()
export class CloudinarySignatureGuard implements CanActivate {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly helperHashService: HelperHashService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest<IRequestApp>();
    const { body } = request;
    const { notification_type } = body;

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

    const cloudinaryApiSecret = this.configService.get<string>(
      'cloudinary.credentials.secret',
    );

    const signedPayload = `${JSON.stringify(body)}${xCldTimestamp}`;

    const isValidSignature1 = this.helperHashService.sha1Compare(
      this.helperHashService.sha1(`${signedPayload}${cloudinaryApiSecret}`),
      xCldSignature,
    );

    // The desired time in seconds for considering the request valid
    const validFor = 3600;
    console.log('#############################################');
    console.log({ body });
    console.log({
      CloudinarySignatureGuard: 'CloudinarySignatureGuard',
      body: bodyString,
      signature: xCldSignature,
      timestamp: xCldTimestamp,
      validFor,
    });

    const isValidSignature =
      await this.cloudinaryService.verifyNotificationSignature({
        body: bodyString,
        signature: xCldSignature,
        timestamp: xCldTimestamp,
        validFor,
      });

    console.log({ isValidSignature1, isValidSignature });
    console.log('#############################################');

    if (!isValidSignature) {
      throw new UnauthorizedException({
        statusCode: EnumWebhookCodeError.WebhookUnauthorizedError,
        message: 'webhook.error.cloudinary.invalidSignature',
      });
    }

    return true;
  }
}
