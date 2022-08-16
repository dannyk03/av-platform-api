import { EnumCurrency, EnumOccasion } from '@avo/type';

import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { isArray } from 'lodash';

import { MinGreaterThan } from '@/utils/request';
import {
  EmptyStringToUndefinedTransform,
  NormalizeEmail,
  NormalizeStringInputTransform,
} from '@/utils/request/transform';

export class GiftSendRecipientDto {
  @NormalizeEmail()
  readonly email: string;

  @MaxLength(30)
  @IsOptional()
  @NormalizeStringInputTransform()
  @EmptyStringToUndefinedTransform()
  readonly firstName?: string;

  @MaxLength(30)
  @IsOptional()
  @NormalizeStringInputTransform()
  @EmptyStringToUndefinedTransform()
  readonly lastName?: string;
}
export class GiftSendSenderDto {
  @MaxLength(50)
  @IsEmail()
  @NormalizeEmail()
  readonly email: string;

  @MaxLength(30)
  @IsOptional()
  @NormalizeStringInputTransform()
  @EmptyStringToUndefinedTransform()
  readonly firstName?: string;

  @MaxLength(30)
  @IsOptional()
  @NormalizeStringInputTransform()
  @EmptyStringToUndefinedTransform()
  readonly lastName?: string;

  @MaxLength(50)
  @IsOptional()
  @NormalizeStringInputTransform()
  @EmptyStringToUndefinedTransform()
  readonly organizationName?: string;
}

export class GiftAdditionalDataDto {
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @Min(0)
  @Max(999)
  @Type(() => Number)
  readonly minPrice: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @Min(1)
  @Max(1000)
  @MinGreaterThan('minPrice')
  @Type(() => Number)
  @IsNotEmpty()
  readonly maxPrice: number;

  @IsNotEmpty()
  @IsEnum(EnumCurrency)
  readonly currency: EnumCurrency;

  @IsNotEmpty()
  @IsEnum(EnumOccasion)
  readonly occasion: EnumOccasion;
}

export class GiftSendDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @IsNotEmpty({ each: true })
  @IsObject({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Transform(({ value }) => {
    return isArray(value) ? value : [value];
  })
  @Type(() => GiftSendRecipientDto)
  readonly recipients: GiftSendRecipientDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => GiftSendSenderDto)
  readonly sender: GiftSendSenderDto;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GiftAdditionalDataDto)
  readonly additionalData: GiftAdditionalDataDto;
}
