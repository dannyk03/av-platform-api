import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  ArrayTransform,
  NormalizeEmail,
  UniqueArrayByTransform,
} from '@/utils/request/transform';

export class SocialConnectionAddresseeDto {
  @NormalizeEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Type(() => String)
  readonly personalNote?: string;
}

export class SocialConnectionRequestDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsArray()
  @IsNotEmpty({ each: true })
  @UniqueArrayByTransform('email')
  @ArrayTransform()
  @Type(() => SocialConnectionAddresseeDto)
  readonly addressees: SocialConnectionAddresseeDto[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Type(() => String)
  readonly personalNote?: string;
}
