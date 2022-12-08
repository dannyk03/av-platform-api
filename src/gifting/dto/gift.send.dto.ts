import { ApiProperty } from '@nestjs/swagger';

import { EnumCurrency, EnumOccasion } from '@avo/type';

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import {
  ArrayTransform,
  UniqueArrayByTransform,
} from '@/utils/request/transform';
import { MinGreaterThan } from '@/utils/request/validation';

export class GiftSendRecipientDto {
  @IsUUID()
  readonly userId: string;
}

export class GiftAdditionalDataDto {
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @Min(0)
  @Max(999)
  @Type(() => Number)
  @ApiProperty()
  readonly minPrice: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @Min(1)
  @Max(1000)
  @MinGreaterThan('minPrice')
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty()
  readonly maxPrice: number;

  @IsNotEmpty()
  @IsEnum(EnumCurrency)
  @ApiProperty()
  readonly currency: EnumCurrency;

  @IsNotEmpty()
  @IsEnum(EnumOccasion)
  @ApiProperty()
  readonly occasion: EnumOccasion;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  targetDate: string;
}

export class GiftSendDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @IsNotEmpty({ each: true })
  @IsObject({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @UniqueArrayByTransform('userId')
  @ArrayTransform()
  @Type(() => GiftSendRecipientDto)
  @ApiProperty()
  readonly recipients: GiftSendRecipientDto[];

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GiftAdditionalDataDto)
  @ApiProperty()
  readonly additionalData: GiftAdditionalDataDto;
}
