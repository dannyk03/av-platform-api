import { Escape, NormalizeEmail, Trim } from 'class-sanitizer';
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
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { isArray } from 'lodash';

import { EnumCurrency, EnumOccasion } from '@avo/type';

import { MinGreaterThan } from '@/utils/request';
import { EmptyStringToUndefinedTransform } from '@/utils/request/transform';

export class GiftSendRecipientDto {
  @MaxLength(50)
  @IsEmail()
  @NormalizeEmail(true)
  @Trim()
  @Escape()
  readonly email: string;

  @MaxLength(30)
  @IsOptional()
  @Trim()
  @Escape()
  @EmptyStringToUndefinedTransform()
  @IsString()
  readonly firstName?: string;

  @MaxLength(30)
  @IsOptional()
  @Trim()
  @Escape()
  @EmptyStringToUndefinedTransform()
  @IsString()
  readonly lastName?: string;
}
export class GiftSendSenderDto {
  @MaxLength(50)
  @IsEmail()
  @NormalizeEmail(true)
  @Trim()
  @Escape()
  readonly email: string;

  @MaxLength(30)
  @IsOptional()
  @Trim()
  @Escape()
  @EmptyStringToUndefinedTransform()
  @IsString()
  readonly firstName?: string;

  @MaxLength(30)
  @IsOptional()
  @Trim()
  @Escape()
  @EmptyStringToUndefinedTransform()
  @IsString()
  readonly lastName?: string;

  @MaxLength(30)
  @IsOptional()
  @Trim()
  @Escape()
  @EmptyStringToUndefinedTransform()
  @IsString()
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
  @Trim(undefined, { each: true })
  @Escape({ each: true })
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
