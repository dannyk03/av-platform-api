import { Transform, Type } from 'class-transformer';
import { Escape, Trim } from 'class-sanitizer';
import {
  IsNotEmpty,
  IsEmail,
  ArrayMaxSize,
  ArrayMinSize,
  IsOptional,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { isArray } from 'lodash';

export class GiftSendGuestDto {
  @IsEmail()
  @MaxLength(50)
  @Transform(({ value }) => value.toLowerCase())
  @Trim()
  @Escape()
  readonly email: string;

  @MaxLength(30)
  @IsOptional()
  @ValidateIf((e) => e.lastName !== '')
  @Trim()
  @Escape()
  @Type(() => String)
  readonly firstName?: string;

  @MaxLength(30)
  @IsOptional()
  @ValidateIf((e) => e.lastName !== '')
  @Trim()
  @Escape()
  @Type(() => String)
  readonly lastName?: string;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @Transform(({ value }) => {
    return isArray(value) ? value : [value];
  })
  @IsEmail(undefined, { each: true })
  @Trim(undefined, { each: true })
  @Escape({ each: true })
  recipients: string[];
}
