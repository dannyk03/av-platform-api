import { JwtGiftSendGuard } from '@/auth/guard/gift';
import { applyDecorators, UseGuards } from '@nestjs/common';

export function GifSendGuard(): any {
  return applyDecorators(UseGuards(JwtGiftSendGuard));
}
