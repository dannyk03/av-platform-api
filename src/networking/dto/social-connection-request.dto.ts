import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import {
  ArrayTransform,
  NormalizeEmail,
  UniqueArrayByTransform,
} from '@/utils/request/transform';

export class SocialConnectionAddresseeDto {
  @NormalizeEmail()
  @IsNotEmpty()
  @MaxLength(100)
  readonly email: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
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
  @ValidateNested()
  @Type(() => SocialConnectionAddresseeDto)
  @ApiProperty()
  readonly addressees: SocialConnectionAddresseeDto[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Type(() => String)
  @ApiProperty({ required: false })
  readonly personalNote?: string;
}
