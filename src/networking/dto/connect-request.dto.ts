import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

import {
  ArrayTransform,
  UniqueArrayTransform,
} from '@/utils/request/transform';

export class ConnectRequestDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsEmail(undefined, { each: true })
  @UniqueArrayTransform()
  @ArrayTransform()
  to: string[];
}
