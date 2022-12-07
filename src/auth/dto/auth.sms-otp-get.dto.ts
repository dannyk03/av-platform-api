import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { NormalizeStringInputTransform } from '@/utils/request/transform';
import { IsPhoneNumber } from '@/utils/request/validation';

export class AuthSmsOtpGetDto {
  @IsPhoneNumber()
  @NormalizeStringInputTransform()
  @Type(() => String)
  @ApiProperty()
  readonly phoneNumber: string;
}
