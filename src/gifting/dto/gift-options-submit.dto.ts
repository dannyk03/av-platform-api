import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { UniqueArrayByTransform } from '@/utils/request/transform';

export class GiftOptionSubmitDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @UniqueArrayByTransform()
  @IsUUID(undefined, { each: true })
  readonly giftOptionIds!: string[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Type(() => String)
  readonly personalNote!: string;
}
