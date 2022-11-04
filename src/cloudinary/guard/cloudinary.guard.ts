import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { EnumWebhookCodeError } from '@avo/type';

import { CloudinaryService } from '../service';

import { IRequestApp } from '@/utils/request/type';

@Injectable()
export class CloudinarySignatureGuard implements CanActivate {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest<IRequestApp>();
    const { body } = request;

    const xCldSignature = request.get('x-cld-signature');
    const xCldTimestamp = request.get('x-cld-timestamp');

    const isValidSignature =
      await this.cloudinaryService.verifyNotificationSignature({
        body,
        signature: xCldSignature,
        timestamp: xCldTimestamp,
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
