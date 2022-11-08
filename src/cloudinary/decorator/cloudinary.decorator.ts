import { UseGuards, applyDecorators } from '@nestjs/common';

import { CloudinarySignatureGuard } from '../guard';

export function CloudinaryWebhookSignature() {
  return applyDecorators(UseGuards(CloudinarySignatureGuard));
}
