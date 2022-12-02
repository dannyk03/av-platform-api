import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';

import { UserProfileDto } from '@/user/dto';

import { TrimTransform } from '@/utils/request/transform';
import { IsPasswordStrong } from '@/utils/request/validation';

export class AuthSignUpDto extends UserProfileDto {
  @IsNotEmpty()
  @MaxLength(30)
  @IsPasswordStrong()
  @TrimTransform()
  @ApiProperty({ required: false })
  @Type(() => String)
  readonly password!: string;
}
