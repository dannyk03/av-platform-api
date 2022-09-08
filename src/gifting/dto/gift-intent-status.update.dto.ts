import { EnumGiftIntentStatus } from '@avo/type';

import { IsNotEmpty } from 'class-validator';

import { IsEnumCaseInsensitiveTransform } from '@/utils/request/transform';

export class GiftIntentStatusUpdateDto {
  @IsEnumCaseInsensitiveTransform(EnumGiftIntentStatus)
  @IsNotEmpty()
  readonly status: string;
}
