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
  @Length(1, 50)
  @IsOptional()
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly city?: string;

  @IsOptional()
  @Length(1, 100)
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly state?: string;

  @IsNotEmpty()
  @IsOptional()
  @Length(1, 100)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly country?: string;
}
export class SurveyPersonalShippingDto {
  @IsNotEmpty()
  @IsOptional()
  @Length(1, 200)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly addressLine1: string;

  @IsNotEmpty()
  @IsOptional()
  @Length(1, 200)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly addressLine2?: string;

  @Length(1, 100)
  @IsNotEmpty()
  @IsOptional()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly city?: string;

  @IsOptional()
  @IsNotEmpty()
  @Length(1, 100)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly state?: string;

  @Length(1, 100)
  @IsNotEmpty()
  @IsOptional()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly country?: string;

  @IsNotEmpty()
  @IsOptional()
  @Length(1, 50)
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
