import { UseGuards, applyDecorators } from '@nestjs/common';

import { JwtGiftSendGuard } from '@/auth/guard/gift';

export function GifSendGuard(): any {
  return applyDecorators(UseGuards(JwtGiftSendGuard));
}
