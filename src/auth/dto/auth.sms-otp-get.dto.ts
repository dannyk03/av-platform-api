import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsPhoneNumber } from 'class-validator';

import { NormalizeStringInputTransform } from '@/utils/request/transform';

export class AuthSmsOtpGetDto {
  @IsPhoneNumber()
  @NormalizeStringInputTransform()
  @Type(() => String)
  @ApiProperty()
  readonly phoneNumber: string;
}
