import { ApiProperty } from '@nestjs/swagger';


import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import {
  NormalizeEmail,
  NormalizeStringInputTransform,
  TrimTransform,
} from '@/utils/request/transform';

export class AuthLoginDto {
  @NormalizeEmail()
  @ApiProperty()
  readonly email: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  readonly rememberMe?: boolean;

  @IsNotEmpty()
  @MaxLength(30)
  @TrimTransform()
  @Type(() => String)
  @ApiProperty()
  readonly password: string;
}

export class AuthMagicLoginDto {
  @NormalizeEmail()
  readonly email: string;

  @MaxLength(30)
  @IsOptional()
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly firstName?: string;

  @MaxLength(30)
  @IsOptional()
  @IsNotEmpty()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly lastName?: string;
}
