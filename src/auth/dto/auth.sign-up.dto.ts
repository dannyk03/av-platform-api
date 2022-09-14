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
  @IsNotEmpty()
  @Length(1, 50)
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly city: string;

  @IsNotEmpty()
  @IsOptional()
  @Length(1, 50)
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly state: string;

  @IsNotEmpty()
  @Length(1, 50)
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly country: string;
}
export class SurveyPersonalShippingDto {
  @IsNotEmpty()
  @Length(1, 20)
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly addressLine1: string;

  @IsNotEmpty()
  @Length(1, 100)
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly addressLine2: string;

  @Length(1, 50)
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @IsNotEmpty()
  @Type(() => String)
  readonly city: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNotEmpty()
  @Length(1, 50)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly state: string;

  @Length(1, 30)
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @IsNotEmpty()
  @Type(() => String)
  readonly country: string;

  @IsNotEmpty()
  @Length(1, 20)
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly zipCode: string;
}

export class SurveyPersonalDto {
  @NormalizeEmail()
  readonly email!: string;

  @IsNotEmpty()
  @IsOptional()
  @Length(1, 20)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly firstName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(1, 30)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly lastName?: string;

  // @IsString()
  // @IsOptional()
  // @IsNotEmpty()
  // @EmptyStringToUndefinedTransform()
  // @Length(10, 20)
  // @IsPhoneNumber()
  // @NormalizeStringInputTransform()
  // @Type(() => String)
  // readonly phoneNumber?: string;

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
  readonly workAnniversaryDay?: string;

  @Allow()
  readonly kidFriendlyActivities: object;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SurveyPersonalAddressDto)
  readonly home: SurveyPersonalAddressDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SurveyPersonalShippingDto)
  readonly shipping: SurveyPersonalShippingDto;
}

export class AuthSignUpDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SurveyPersonalDto)
  readonly personal: SurveyPersonalDto;

  @Allow()
  readonly personas: object;

  @Allow()
  readonly dietary: object;

  @IsNotEmpty()
  @MaxLength(30)
  @IsPasswordStrong()
  @TrimTransform()
  @Type(() => String)
  readonly password!: string;
}
