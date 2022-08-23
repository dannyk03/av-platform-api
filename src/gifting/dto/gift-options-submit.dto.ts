import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

import { UniqueArrayByTransform } from '@/utils/request/transform';

export class GiftOptionSubmitDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @UniqueArrayByTransform()
  @IsUUID(undefined, { each: true })
  giftOptionIds: string[];
}
