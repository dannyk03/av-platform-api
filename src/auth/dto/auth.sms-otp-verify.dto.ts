import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { AuthSmsOtpGetDto } from './auth.sms-otp-get.dto';

import { NormalizeStringInputTransform } from '@/utils/request/transform';
import { IsSmsOtpCode } from '@/utils/request/validation';

export class AuthSmsOtpVerifyDto extends AuthSmsOtpGetDto {
  @IsSmsOtpCode()
  @NormalizeStringInputTransform()
  @Type(() => String)
  @ApiProperty()
  readonly code: string;
}
