import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import {
  EmptyStringToUndefinedTransform,
  NormalizeStringInputTransform,
  UniqueArrayByTransform,
} from '@/utils/request/transform';

export class GiftOptionSubmitDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @UniqueArrayByTransform()
  @IsUUID(undefined, { each: true })
  readonly giftOptionIds!: string[];

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  @EmptyStringToUndefinedTransform()
  @NormalizeStringInputTransform()
  @Type(() => String)
  @ApiProperty()
  readonly submitReason?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Type(() => String)
  readonly personalNote!: string;
}
