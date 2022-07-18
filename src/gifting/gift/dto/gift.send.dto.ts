import { Transform, Type } from 'class-transformer';
import { Escape, Trim } from 'class-sanitizer';
import {
  IsNotEmpty,
  IsEmail,
  ArrayMaxSize,
  ArrayMinSize,
  MaxLength,
  IsOptional,
  IsObject,
  IsArray,
} from 'class-validator';
import { isArray } from 'lodash';
import { ValidateNested } from '@/utils/request';

export class GiftSendRecipientDto {
  @MaxLength(50)
  @Transform(({ value }) => value?.toLowerCase())
  @IsEmail()
  @Trim()
  @Escape()
  readonly email: string;

  @MaxLength(30)
  @IsOptional()
  @IsNotEmpty()
  @Trim()
  @Escape()
  @Type(() => String)
  readonly firstName?: string;

  @MaxLength(30)
  @IsOptional()
  @IsNotEmpty()
  @Trim()
  @Escape()
  @Type(() => String)
  readonly lastName?: string;
}

export class GiftSendDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsNotEmpty({ each: true })
  @Trim(undefined, { each: true })
  @Escape({ each: true })
  @IsObject({ each: true })
  @IsArray()
  // @ValidateNested({ each: true, message: 'Invalid recipients data' })
  @ValidateNested(GiftSendRecipientDto)
  @Transform(({ value }) => {
    return isArray(value) ? value : [value];
  })
  @Type(() => GiftSendRecipientDto)
  readonly recipients: GiftSendRecipientDto[];

  @IsEmail()
  @MaxLength(100)
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  @Trim()
  @Escape()
  readonly email: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(30)
  @Type(() => String)
  readonly firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(30)
  @Type(() => String)
  readonly lastName?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(30)
  @Type(() => String)
  readonly organizationName?: string;
}
