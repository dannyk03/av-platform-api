import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsPhoneNumber } from 'class-validator';

import { NormalizeStringInputTransform } from '@/utils/request/transform';
import { IsRegisteredUser } from '@/utils/request/validation';

export class AuthSmsOtpGetDto {
  @IsPhoneNumber()
  @NormalizeStringInputTransform()
  @Type(() => String)
  @IsRegisteredUser()
  @ApiProperty()
  readonly phoneNumber: string;
}
