import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

import { UniqueArrayTransform } from '@/utils/request/transform';

export class GiftOptionSubmitDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @UniqueArrayTransform()
  @IsUUID(undefined, { each: true })
  giftOptionIds: string[];
}
