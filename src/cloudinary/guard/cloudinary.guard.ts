import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnumWebhookCodeError } from '@avo/type';

import { HelperHashService } from '@/utils/helper/service';

import { IRequestApp } from '@/utils/request/type';

@Injectable()
export class CloudinarySignatureGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly helperHashService: HelperHashService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest<IRequestApp>();
    const { body } = request;

    const xCldSignature = request.get('x-cld-signature');
    const xCldTimestamp = request.get('x-cld-timestamp');

    const cloudinaryApiSecret = this.configService.get<string>(
      'cloudinary.credentials.secret',
    );

    const signedPayload = `${JSON.stringify(body)}${xCldTimestamp}`;

    const isValidSignature = this.helperHashService.sha1Compare(
      this.helperHashService.sha1(`${signedPayload}${cloudinaryApiSecret}`),
      xCldSignature,
    );

    if (!isValidSignature) {
      throw new UnauthorizedException({
        statusCode: EnumWebhookCodeError.WebhookUnauthorizedError,
        message: 'webhook.error.cloudinary.invalidSignature',
      });
    }

    return true;
  }
}
