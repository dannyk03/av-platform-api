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
  @ValidateNested()
  @Type(() => SocialConnectionAddresseeDto)
  @ApiProperty()
  readonly addressees: SocialConnectionAddresseeDto[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Type(() => String)
  @ApiProperty({ required: false })
  readonly personalNote?: string;
}
