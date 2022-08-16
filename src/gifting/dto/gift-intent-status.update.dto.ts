import { EnumGiftIntentStatus } from '@avo/type';

import { IsEnum, IsNotEmpty } from 'class-validator';

export class GiftIntentStatusUpdateDto {
  @IsEnum(EnumGiftIntentStatus)
  @IsNotEmpty()
  status: string;
}
