import { ApiProperty } from '@nestjs/swagger';

import { EnumWorkType } from '@avo/type';

import { Transform, Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import {
  ConsecutiveWhitespaceTransform,
  EmptyStringToUndefinedTransform,
  NormalizeEmail,
  NormalizeStringInputTransform,
  PadWith,
} from '@/utils/request/transform';
import {
  IsIsAcceptableEmail,
  IsPhoneNumber,
  IsValidDayOfMonth,
  IsValidMonth,
  NotAfterThisYear,
} from '@/utils/request/validation';

export class SurveyPersonalAddressDto {
  @MaxLength(50)
  @IsOptional()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly city?: string;

  @IsOptional()
  @MaxLength(100)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly state?: string;

  @IsOptional()
  @MaxLength(100)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly country?: string;
}

export class SurveyAddressDto {
  @IsOptional()
  @MaxLength(200)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly addressLine1: string;

  @IsOptional()
  @MaxLength(200)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly addressLine2?: string;

  @MaxLength(100)
  @IsOptional()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly city?: string;

  @IsOptional()
  @MaxLength(100)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly state?: string;

  @MaxLength(100)
  @IsOptional()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly country?: string;

  @IsOptional()
  @MaxLength(50)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly zipCode?: string;
}

export class SurveyPersonalShippingDto extends SurveyAddressDto {
  @IsOptional()
  @MaxLength(1000)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly deliveryInstructions: string;
}

export class SurveyPersonalDto {
  @IsIsAcceptableEmail()
  @NormalizeEmail()
  readonly email!: string;

  @IsNotEmpty()
  @Length(1, 50)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly firstName: string;

  @IsNotEmpty()
  @Length(1, 50)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber()
  @EmptyStringToUndefinedTransform()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly phoneNumber?: string;

  @IsOptional()
  @MaxLength(2)
  @PadWith({
    padString: '0',
    targetLength: 2,
  })
  @IsValidMonth()
  @IsNumberString({ no_symbols: true })
  @EmptyStringToUndefinedTransform()
  @NormalizeStringInputTransform()
  @Transform(({ obj, value }) => {
    return value && !obj.birthDay ? undefined : value;
  })
  readonly birthMonth?: string;

  @IsOptional()
  @MaxLength(2)
  @IsValidDayOfMonth('birthMonth', 'birthYear')
  @PadWith({
    padString: '0',
    targetLength: 2,
  })
  @IsNumberString({ no_symbols: true })
  @EmptyStringToUndefinedTransform()
  @NormalizeStringInputTransform()
  @Transform(({ obj, value }) => {
    return value && !obj.birthMonth ? undefined : value;
  })
  readonly birthDay?: string;

  @IsOptional()
  @NotAfterThisYear()
  @IsNumberString({ no_symbols: true })
  @PadWith({
    padString: '20',
    targetLength: 4,
  })
  @EmptyStringToUndefinedTransform()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly workAnniversaryYear?: string;

  @IsOptional()
  @PadWith({
    padString: '0',
    targetLength: 2,
  })
  @IsValidMonth()
  @IsNumberString({ no_symbols: true })
  @EmptyStringToUndefinedTransform()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly workAnniversaryMonth?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(2)
  @IsValidDayOfMonth('workAnniversaryMonth', 'workAnniversaryYear')
  @PadWith({
    padString: '0',
    targetLength: 2,
  })
  @IsNumberString({ no_symbols: true })
  @EmptyStringToUndefinedTransform()
  @NormalizeStringInputTransform()
  @Type(() => String)
  @Transform(({ obj, value }) => {
    return value && !obj.workAnniversaryMonth ? undefined : value;
  })
  @ApiProperty({ required: false })
  readonly workAnniversaryDay?: string;

  @Allow()
  @ApiProperty()
  readonly kidFriendlyActivities: object;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SurveyPersonalAddressDto)
  @ApiProperty()
  readonly home?: SurveyPersonalAddressDto;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SurveyPersonalShippingDto)
  @ApiProperty()
  readonly shipping?: SurveyPersonalShippingDto;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ConsecutiveWhitespaceTransform()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly company?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ConsecutiveWhitespaceTransform()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly jobRole?: string;

  @IsOptional()
  @IsEnum(EnumWorkType)
  readonly jobType?: EnumWorkType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ConsecutiveWhitespaceTransform()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly department?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  @ApiProperty()
  readonly funFacts: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  @ApiProperty()
  readonly desiredSkills: string[];

  @Allow()
  @ApiProperty()
  readonly upcomingMilestones: object;
}

export class UserProfileDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SurveyPersonalDto)
  @ApiProperty()
  readonly personal: SurveyPersonalDto;

  @Allow()
  @ApiProperty()
  readonly personas: object;

  @Allow()
  @ApiProperty()
  readonly dietary: object;
}
