import { ApiProperty } from '@nestjs/swagger';

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
  UniqueArrayByTransform,
} from '@/utils/request/transform';

export class SocialConnectionRequestApproveDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  @UniqueArrayByTransform()
  @ArrayTransform()
  @IsOptional()
  @ApiProperty()
  connectionRequestIds: string[];
}
