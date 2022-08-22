import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

import {
  ArrayTransform,
  UniqueArrayTransform,
} from '@/utils/request/transform';

export class ConnectRequestUpdateDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  @UniqueArrayTransform()
  @ArrayTransform()
  @IsOptional()
  socialConnectionRequestIds: string[];
}
