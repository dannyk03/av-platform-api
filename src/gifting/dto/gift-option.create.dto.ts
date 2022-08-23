import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

import {
  ArrayTransform,
  UniqueArrayByTransform,
} from '@/utils/request/transform';

export class GiftOptionCreateDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  @UniqueArrayByTransform()
  @ArrayTransform()
  productIds: string[];
}
