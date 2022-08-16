import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

import { ArrayTransform } from '@/utils/request/transform';

export class GiftOptionCreateDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  @ArrayTransform()
  productIds: string[];
}
