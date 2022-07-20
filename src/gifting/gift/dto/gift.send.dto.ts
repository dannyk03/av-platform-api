import { Transform, Type } from 'class-transformer';
import { Escape, Trim } from 'class-sanitizer';
import {
  IsEmail,
  ArrayMaxSize,
  ArrayMinSize,
  MaxLength,
  IsOptional,
  IsObject,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { isArray } from 'lodash';
import {
  EmptyStringToUndefinedTransform,
  ToLowerCaseTransform,
} from '@/utils/request/transform';
// import { ValidateNested } from '@/utils/request';

export class GiftSendRecipientDto {
  @MaxLength(50)
  @ToLowerCaseTransform()
  @IsEmail()
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
  @ToLowerCaseTransform()
  @IsEmail()
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

export class GiftSendDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @IsNotEmpty({ each: true })
  @Trim(undefined, { each: true })
  @Escape({ each: true })
  @IsObject({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  // @ValidateNested(GiftSendRecipientDto)
  @Transform(({ value }) => {
    return isArray(value) ? value : [value];
  })
  @Type(() => GiftSendRecipientDto)
  readonly recipients: GiftSendRecipientDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => GiftSendSenderDto)
  readonly sender: GiftSendSenderDto;
}
