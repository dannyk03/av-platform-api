import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  NormalizeEmail,
  NormalizeStringInputTransform,
  TrimTransform,
} from '@/utils/request/transform';
import { IsPasswordStrong } from '@/utils/request/validation';

export class UserCreateDto {
  @NormalizeEmail()
  @ApiProperty()
  readonly email: string;

  @MaxLength(30)
  @IsOptional()
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  @ApiProperty({ required: false })
  readonly firstName?: string;

  @MaxLength(30)
  @IsOptional()
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  @ApiProperty({ required: false })
  readonly lastName?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(14)
  @IsPhoneNumber()
  @NormalizeStringInputTransform()
  @ApiProperty({ required: false })
  readonly phoneNumber?: string;

  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @ApiProperty()
  readonly role: string;

  @IsNotEmpty()
  @IsPasswordStrong()
  @TrimTransform()
  @Type(() => String)
  @ApiProperty()
  readonly password: string;
}
