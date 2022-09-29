import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  Allow,
  IsNotEmpty,
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
  TrimTransform,
} from '@/utils/request/transform';
import { IsPasswordStrong, IsPhoneNumber } from '@/utils/request/validation';

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
export class SurveyPersonalShippingDto {
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

export class SurveyPersonalDto {
  @NormalizeEmail()
  readonly email!: string;

  @IsNotEmpty()
  @Length(1, 50)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly lastName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @EmptyStringToUndefinedTransform()
  @Length(10, 20)
  @IsPhoneNumber()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly phoneNumber?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(2)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly birthMonth?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(2)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly birthDay?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(2)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly workAnniversaryMonth?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(2)
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
}

export class AuthSignUpDto {
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

  @IsNotEmpty()
  @MaxLength(30)
  @IsPasswordStrong()
  @TrimTransform()
  @ApiProperty({ required: false })
  @Type(() => String)
  readonly password!: string;
}
