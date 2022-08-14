import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

import { ArrayTransform } from '@/utils/request/transform';

export class ProductImageBulkDeleteDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  @ArrayTransform()
  readonly ids!: string[];
}
