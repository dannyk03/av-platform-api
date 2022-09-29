import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

import { NormalizeStringInputTransform } from '@/utils/request/transform';

export class AuthResetPasswordRequestDto {
  @IsNotEmpty()
  @IsEmail()
  @NormalizeStringInputTransform()
  @Type(() => String)
  @ApiProperty()
  readonly email: string;
}
