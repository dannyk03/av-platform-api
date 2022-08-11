import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

import { UniqueArray } from '@/utils/request/transform';

export class GiftOptionSubmitDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @UniqueArray()
  @IsUUID(undefined, { each: true })
  giftOptionIds: string[];
}
