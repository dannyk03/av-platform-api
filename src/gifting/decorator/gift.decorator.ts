import { UseGuards, applyDecorators } from '@nestjs/common';

import { JwtOptionalGuard } from '@/auth/guard/optional';

export function GifSendGuard(): any {
  return applyDecorators(UseGuards(JwtOptionalGuard));
}
