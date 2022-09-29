import { ApiProperty } from '@nestjs/swagger';

import { NormalizeEmail } from '@/utils/request/transform';

export class AuthResendSignupEmailDto {
  @NormalizeEmail()
  @ApiProperty()
  readonly email!: string;
}
