import { UseGuards, applyDecorators } from '@nestjs/common';

import { JwtOptionalGuard } from '@/auth/guards/optional';

export function GifSendGuard(): any {
  return applyDecorators(UseGuards(JwtOptionalGuard));
}
