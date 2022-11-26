import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import {
  EmptyStringToUndefinedTransform,
  NormalizeEmail,
  NormalizeStringInputTransform,
  PaddingWith,
} from '@/utils/request/transform';
import { IsPhoneNumber, IsValidDayOfMonth } from '@/utils/request/validation';

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
  @EmptyStringToUndefinedTransform()
  @IsPhoneNumber()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly phoneNumber?: string;

  @IsOptional()
  @MaxLength(2)
  @PaddingWith({
    padString: '0',
    targetLength: 2,
  })
  @IsNumberString({ no_symbols: true })
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly birthMonth?: string;

  @IsOptional()
  @MaxLength(2)
  @IsValidDayOfMonth('birthMonth', 'birthYear')
  @PaddingWith({
    padString: '0',
    targetLength: 2,
  })
  @IsNumberString({ no_symbols: true })
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly birthDay?: string;

  @IsOptional()
  @PaddingWith({
    padString: '0',
    targetLength: 2,
  })
  @IsNumberString({ no_symbols: true })
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly workAnniversaryMonth?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(2)
  @IsValidDayOfMonth('workAnniversaryMonth', 'workAnniversaryYear')
  @PaddingWith({
    padString: '0',
    targetLength: 2,
  })
  @IsNumberString({ no_symbols: true })
  @NormalizeStringInputTransform()
  @Type(() => String)
  @ApiProperty({ required: false })
  readonly workAnniversaryDay?: string;

  @Allow()
  @ApiProperty()
  readonly kidFriendlyActivities: object;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SurveyPersonalAddressDto)
  @ApiProperty()
  readonly home: SurveyPersonalAddressDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SurveyPersonalShippingDto)
  @ApiProperty()
  readonly shipping: SurveyPersonalShippingDto;

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
