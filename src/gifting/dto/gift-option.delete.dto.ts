import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

import { UniqueArrayByTransform } from '@/utils/request/transform';

export class GiftOptionDeleteDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @UniqueArrayByTransform()
  @IsUUID(undefined, { each: true })
  readonly giftOptionIds: string[];
}
