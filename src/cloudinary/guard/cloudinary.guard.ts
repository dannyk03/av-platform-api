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

    const xCldSignature = request.get('x-cld-signature');
    const xCldTimestamp = request.get('x-cld-timestamp');

    // The desired time in seconds for considering the request valid
    const validFor = 3600;

    const isValidSignature =
      await this.cloudinaryService.verifyNotificationSignature({
        body: request.rawBody.toString(),
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
