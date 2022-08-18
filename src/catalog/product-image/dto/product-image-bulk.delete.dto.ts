import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

import {
  ArrayTransform,
  UniqueArrayTransform,
} from '@/utils/request/transform';

export class ProductImageBulkDeleteDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  @UniqueArrayTransform()
  @ArrayTransform()
  readonly ids!: string[];
}
